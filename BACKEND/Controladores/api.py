import json
import logging
import os
import requests
import uuid
from datetime import datetime
from functools import wraps
from flask_cors import CORS
from flask import Flask, request, jsonify
from Entidades.User import Database, AuthService,User
from Entidades.voiceflowconfig import update_conversation_stage,process_voiceflow_response,determine_response_context,get_timestamp
from Entidades.apitoIA import call_groq_api


app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:4000", "supports_credentials": True}})
QUIZ_STORAGE_PATH = "generated_quizzes"

if not os.path.exists(QUIZ_STORAGE_PATH):
    os.makedirs(QUIZ_STORAGE_PATH)


def token_required(f):
    @wraps(f)#mantener la identidad de la función original cuando se usa un decorador
    def decorated(*args, **kwargs):
        token = None
        # Obtener el token del encabezado Authorization
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].replace("Bearer ", "")
        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        auth_service = AuthService(Database())
        token_info = auth_service.verify_token(token)
        if not token_info:
            return jsonify({"message": "Invalid or expired token!"}), 401

        # Pasar la información del usuario a la ruta
        return f(token_info, *args, **kwargs)

    return decorated


@app.route("/api/teacher/dashboard/chat/generate-quiz", methods=["POST"])
@token_required
def generate_quiz(token_info):
    """Endpoint para generar quiz usando Groq IA generativa"""
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "Access denied! Teacher only."}), 403

    try:
        data = request.get_json()
        user_prompt = data.get("prompt", "")
        age_group = data.get("age_group", "3-5 años")  # Nuevo parámetro para edad

        if not user_prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Configurar el prompt del sistema especializado para educación inicial
        system_prompt = f"""Eres un asistente educativo especializado en crear quizzes para niños de educación inicial ({age_group}).

        IMPORTANTE: Las preguntas deben ser apropiadas para niños pequeños:
        - Usar vocabulario simple y claro
        - Conceptos básicos y concretos
        - Relacionados con su entorno cotidiano
        - Preguntas divertidas y atractivas

        Basándote en el tema proporcionado, genera un quiz de exactamente 5 preguntas de opción múltiple.

        Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
        No respondas comentando el formato JSON
        {{
            "title": "Título atractivo del quiz para niños",
            "topic": "Tema principal",
            "age_group": "{age_group}",
            "questions": [
                {{
                    "question": "Pregunta simple y clara aquí",
                    "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
                    "correct_answer": 0,
                    "explanation": "Explicación simple y positiva para niños"
                }}
            ]
        }}

        Ejemplo de buenas preguntas para niños:
        - "¿Qué animal hace 'miau'?"
        - "¿De qué color es el sol?"
        - "¿Cuántas patas tiene un perro?"
        - "¿Qué comes en el desayuno?"

        - Las opciones deben ser simples y familiares para los niños
        - El índice de correct_answer corresponde a la posición en el array options (0-3)
        - Las explicaciones deben ser positivas y alentadoras
        
        """

        # Llamada a la API de Groq
        quiz_response = call_groq_api(system_prompt, user_prompt)

        if not quiz_response:
            return jsonify({"error": "Failed to generate quiz"}), 500

        # Generar ID único para el quiz
        quiz_id = str(uuid.uuid4())
        timestamp = datetime.now().isoformat()

        # Estructura completa del quiz
        quiz_data = {
            "created_by": token_info["user_id"],
            "created_at": timestamp,
            "original_prompt": user_prompt,
            **quiz_response#Agregar todos los campos de quiz_response
        }

        # Guardar quiz en archivo
        filename = f"quiz_{quiz_id}.json"
        filepath = os.path.join(QUIZ_STORAGE_PATH, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(quiz_data, f, ensure_ascii=False, indent=2)
        auth_service = AuthService(Database())
        auth_service.register_quiz(quiz_id, token_info["user_id"], quiz_response["title"], quiz_data, timestamp)
        return jsonify({
            "success": True,
            "filename": filename,
            "quiz_data": quiz_data,
            "message": "Quiz generated and saved successfully!"
        })

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route("/api/teacher/dashboard/quiz/<quiz_id>", methods=["GET"])
@token_required
def get_quiz_teacher(token_info, quiz_id):
    """Endpoint para obtener un quiz guardado"""
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "Access denied! Teacher only."}), 403

    authservice = AuthService(Database())

    quiz = authservice.get_quiz(quiz_id)

    return jsonify({"quiz": quiz})


@app.route("/api/student/dashboard/quiz/<quiz_id>", methods=["GET"])
@token_required
def get_quiz_alumno(token_info, quiz_id):
    """Endpoint para obtener un quiz guardado"""
    if token_info["user_type"] != "estudiante":
        return jsonify({"message": "Access denied! Teacher only."}), 403

    authservice = AuthService(Database())

    quiz = authservice.get_quiz(quiz_id)

    return jsonify({"quiz": quiz})


@app.route("/api/student/dashboard", methods=["GET"])
@token_required
def student_dashboard(token_info):
    if token_info["user_type"] != "student":
        return jsonify({"message": "Access denied! Student only."}), 403
    return jsonify({"message": f"Welcome student {token_info['user_id']}!", "user": token_info})


@app.route("/api/teacher/dashboard", methods=["GET"])
@token_required
def teacher_dashboard(token_info):
    if token_info["user_type"] != "teacher":
        return jsonify({"message": "Access denied! Teacher only."}), 403
    return jsonify({"message": f"Welcome teacher {token_info['user_id']}!", "user": token_info})


# Rutas de autenticación
@app.route("/api/register", methods=["POST"])
def register():
    usuario=User
    data = request.get_json()
    usuario.email = data.get("email")
    usuario.nombre = data.get("nombre")
    usuario.password = data.get("password")
    usuario.user_type = data.get("user_type")

    if not usuario.email or not usuario.password or not usuario.user_type :
        return jsonify({"message": "Missing required fields!"}), 400

    if usuario.user_type!="estudiante" and usuario.user_type!="profesor":
        return jsonify(({"message": "Solo existen dos tipos de usuarios, estudiante o profesores"}))

    auth_service = AuthService(Database())
    if auth_service.register_user(usuario):
        return jsonify({"message": "User registered successfully!"}), 201
    return jsonify({"message": "Email already exists!"}), 400


@app.route("/api/login", methods=["POST"])
def login():
    usuario = User
    data = request.get_json()
    usuario.email = data.get("email")
    usuario.password = data.get("password")
    usuario.user_type = data.get("user_type")

    if not usuario.email or not usuario.password or not usuario.user_type:
        return jsonify({"message": "Missing required fields!"}), 400

    auth_service = AuthService(Database())
    user = auth_service.login_user(usuario)
    if user:
        return jsonify({"message": "Login successful!", "user": user}), 200
    return jsonify({"message": "Invalid credentials or user type!"}), 401

@app.route("/api/teacher/dashboard/quizzes", methods=["GET"])
@token_required
def list_quizzes(token_info):
    """Endpoint para listar todos los quizzes creados por el profesor"""
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "Access denied! Teacher only."}), 403
    teacher_id = token_info["user_id"]
    auth_service = AuthService(Database())
    quizzes = auth_service.get_all_quizzes(teacher_id)
    return jsonify({"quizzes": quizzes}), 200


@app.route("/api/estudiante/dashboard/quizzes", methods=["GET"])
@token_required
def list_quizzes_estudiante(token_info):
    """Endpoint para listar todos los quizzes que se le han asignado a los estudiantes"""
    if token_info["user_type"] != "estudiante":
        return jsonify({"message": "Access denied! Estudiante only."}), 403
    estudiante_id = token_info["user_id"]
    auth_service = AuthService(Database())
    quizzes = auth_service.get_all_quizzes_estudiante(estudiante_id)
    return jsonify({"quizzes": quizzes}), 200


@app.route("/api/teacher/dashboard/asignar", methods=["POST"])
@token_required
def asign_quizzes(token_info):
    """Endpoint para listar todos los quizzes creados por el profesor"""
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "Access denied! Teacher only."}), 403
    teacher_id = token_info["user_id"]
    data = request.get_json()
    alumno_id = data.get("alumno_id")
    quiz_id=data.get("quiz_id")
    auth_service = AuthService(Database())
    auth_service.register_quiz_toalumn(alumno_id,quiz_id)

    return jsonify({"Asignacion Exitosa": alumno_id + "to" + quiz_id}), 200





# --- NUEVAS RUTAS PARA LISTAR USUARIOS (SOLO PROFESORES) ---


@app.route("/api/teacher/listare", methods=["GET"])
@token_required
def list_students(token_info):
    """
    Permite a un profesor listar todos los estudiantes registrados.
    Requiere autenticación de profesor.
    """
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "Access denied! Teacher only."}), 403

    auth_service = AuthService(Database())
    students = auth_service.get_all_students()
    return jsonify({"students": students}), 200

@app.route("/api/student/<student_id>", methods=["GET"])
@token_required
def get_alumno(token_info,student_id):
    auth_service = AuthService(Database())
    student = auth_service.get_estudiante(student_id)
    return jsonify({"student":student})

@app.route("/api/teacher/<teacher_id>", methods=["GET"])
@token_required
def get_teacher(token_info,teacher_id):
    auth_service = AuthService(Database())
    student = auth_service.get_teacher(teacher_id)
    return jsonify({"student":student})

@app.route("/api/teacher/delete/quizStudent", methods=["DELETE"])
@token_required
def delete_student_from_quiz(token_info):
    if token_info["user_type"]!="profesor":
        return jsonify({"message":"Acceso no autorizado"})
    data=request.get_json()
    quiz_id=data.get("quiz_id")
    student_id=data.get("student_id")
    auth_service = AuthService(Database())
    auth_service.delete_student_from_quiz(student_id,quiz_id)
    return jsonify({"Estudiante eliminado de la tarea":quiz_id })



@app.route("/api/teacher/listarp", methods=["GET"])
@token_required
def list_teachers(token_info):
    """
    Permite a un profesor listar todos los profesores registrados.
    Requiere autenticación de profesor.
    """
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "Access denied! Teacher only."}), 403

    auth_service = AuthService(Database())
    teachers = auth_service.get_all_teachers()
    return jsonify({"teachers": teachers}), 200



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

VOICEFLOW_API_KEY = 'VF.DM.684083d4f4b750595bb087cc.9D3fyyGv5PjiDPOf'  # Reemplazar con tu API key real
PROJECT_ID = '684073a2bf6bbd4e0490c83a'      # Reemplazar con tu project ID real
BASE_URL = "https://general-runtime.voiceflow.com/state/user"

user_sessions = {}


def get_headers():
    return {
        "Authorization": VOICEFLOW_API_KEY,
        "Content-Type": "application/json"
    }


@app.route('/chat/start', methods=['POST'])
def start_chat():
    """Inicia una nueva conversación"""
    try:
        # Generar ID único para la sesión
        session_id = str(uuid.uuid4())
        user_id = f"user_{session_id}"

        # Inicializar la conversación con Voiceflow
        url = f"{BASE_URL}/{user_id}/interact"
        body = {"action": {"type": "launch"}}

        response = requests.post(url, json=body, headers=get_headers())

        if response.status_code == 200:
            data = response.json()
            logger.info(f"Conversación iniciada para sesión {session_id}")

            # Procesar la respuesta inicial de Voiceflow
            processed_response = process_voiceflow_response(data, session_id)

            # Guardar información de la sesión
            user_sessions[session_id] = {
                'user_id': user_id,
                'active': True,
                'stage': 'asking_name',  # Etapa inicial: preguntando nombre
                'user_name': None,
                'conversation_history': [processed_response]
            }

            return jsonify({
                "success": True,
                "session_id": session_id,
                "response": processed_response
            })
        else:
            logger.error(f"Error al iniciar conversación: {response.status_code}")
            return jsonify({"success": False, "error": "No se pudo iniciar la conversación"}), 500

    except Exception as e:
        logger.error(f"Error en start_chat: {str(e)}")
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500


@app.route('/chat/message', methods=['POST'])
def send_message():
    """Envía un mensaje en una conversación existente"""

    try:
        print("Ga")
        data = request.json
        print("Ga")
        session_id = data.get('session_id')
        print("Ga")
        user_message = data.get('message', '').strip()
        print("Ga")

        # Validaciones
        if not session_id or session_id not in user_sessions:
            return jsonify({"success": False, "error": "Sesión inválida o expirada"}), 400

        session = user_sessions[session_id]
        if not session['active']:
            return jsonify({"success": False, "error": "La conversación ha terminado"}), 400

        if not user_message:
            return jsonify({"success": False, "error": "El mensaje no puede estar vacío"}), 400

        # Actualizar etapa de la conversación basada en el contexto
        update_conversation_stage(session, user_message)

        # Enviar mensaje a Voiceflow
        user_id = session['user_id']
        url = f"{BASE_URL}/{user_id}/interact"

        body = {
            "action": {
                "type": "text",
                "payload": user_message
            }
        }
        print("Ga")
        response = requests.post(url, json=body, headers=get_headers())

        if response.status_code == 200:
            response_data = response.json()
            processed_response = process_voiceflow_response(response_data, session_id)

            # Guardar en historial
            session['conversation_history'].extend([
                {"type": "user", "message": user_message, "timestamp": get_timestamp()},
                processed_response
            ])

            # Verificar si la conversación terminó
            if processed_response.get('conversation_ended'):
                session['active'] = False
                logger.info(f"Conversación terminada para sesión {session_id}")

            return jsonify({
                "success": True,
                "session_id": session_id,
                "response": processed_response,
                "conversation_active": session['active']
            })
        else:
            logger.error(f"Error al enviar mensaje: {response.status_code}")
            return jsonify({"success": False, "error": "No se pudo enviar el mensaje"}), 500

    except Exception as e:
        logger.error(f"Error en send_message: {str(e)}")
        return jsonify({"success": False, "error": "Error interno del servidor"}), 500


# Ejemplo de uso
if __name__ == "__main__":
    db = Database()
    auth = AuthService(db)
    # Registro de usuarios
    # Ejecutar la aplicación Flask
    app.run(debug=True)