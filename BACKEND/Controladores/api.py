import json
import logging
import os
import requests
import uuid
from datetime import datetime
from functools import wraps
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from BACKEND.Entidades.voiceflowconfig import update_conversation_stage,process_voiceflow_response,determine_response_context,get_timestamp
from BACKEND.Entidades.User import Database, AuthService
from BACKEND.Entidades.apitoIA import call_groq_api
from BACKEND.Entidades.apitoIA import call_groq_api

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    },
    r"/chat/*": {  # Agregar esta configuración para las rutas de Voiceflow
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})  # Permitir solicitudes desde el frontend React
QUIZ_STORAGE_PATH = "generated_quizzes"

if not os.path.exists(QUIZ_STORAGE_PATH):
    os.makedirs(QUIZ_STORAGE_PATH)


@app.route("/api/<path:path>", methods=["OPTIONS"])
def handle_options(path):
    response = make_response()
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

def token_required(f):
       @wraps(f)
       def decorated(*args, **kwargs):
           token = None
           if "Authorization" in request.headers:
               token = request.headers["Authorization"].replace("Bearer ", "")
           if not token:
               return jsonify({"message": "¡Falta el token!"}), 401

           auth_service = AuthService(Database())
           token_info = auth_service.verify_token(token)
           if not token_info:
               return jsonify({"message": "¡Token inválido o expirado!"}), 401

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
            "quiz_id": quiz_id,
            "created_by": token_info["user_id"],
            "created_at": timestamp,
            "original_prompt": user_prompt,
            **quiz_response#Agregar todos los campos de quiz_response a esto
        }

        # Guardar quiz en archivo
        filename = f"quiz_{quiz_id}.json"
        filepath = os.path.join(QUIZ_STORAGE_PATH, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(quiz_data, f, ensure_ascii=False, indent=2)

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
def get_quiz(token_info, quiz_id):
    """Endpoint para obtener un quiz guardado"""
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "Access denied! Teacher only."}), 403

    try:
        filename = f"quiz_{quiz_id}.json"
        filepath = os.path.join(QUIZ_STORAGE_PATH, filename)

        if not os.path.exists(filepath):
            return jsonify({"error": "Quiz not found"}), 404

        with open(filepath, 'r', encoding='utf-8') as f:
            quiz_data = json.load(f)

        return jsonify(quiz_data)

    except Exception as e:
        return jsonify({"error": f"Error loading quiz: {str(e)}"}), 500


@app.route("/api/student/dashboard", methods=["GET"])
@token_required
def student_dashboard(token_info):
    if token_info["user_type"] != "student":
        return jsonify({"message": "¡Acceso denegado! Solo para estudiantes."}), 403
    return jsonify({"message": f"¡Bienvenido estudiante {token_info['user_id']}!", "user": token_info})

@app.route("/api/teacher/dashboard", methods=["GET"])
@token_required
def teacher_dashboard(token_info):
    if token_info["user_type"] != "teacher":
        return jsonify({"message": "¡Acceso denegado! Solo para profesores."}), 403
    return jsonify({"message": f"¡Bienvenido profesor {token_info['user_id']}!", "user": token_info})


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    confirm_password = data.get("confirm_password")
    if password != confirm_password:
        return jsonify({"message": "Passwords do not match!"}), 400
    user_type = data.get("user_type")

    if not email or not password or not user_type:
        return jsonify({"message": "¡Faltan campos requeridos!"}), 400

    if user_type not in ["estudiante", "profesor"]:
        return jsonify({"message": "Solo se permiten tipos de usuario estudiante o profesor."}), 400

    auth_service = AuthService(Database())
    if auth_service.register_user(email, username, password, user_type):
        return jsonify({"message": "¡Usuario registrado exitosamente!"}), 201
    return jsonify({"message": "¡El correo ya existe o las contraseñas no coinciden!"}), 400

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type")

    if not email or not password or not user_type:
        return jsonify({"message": "¡Faltan campos requeridos!"}), 400

    auth_service = AuthService(Database())
    user = auth_service.login_user(email, password, user_type)
    if user:
        # Asegúrate de que user incluya user_type
        response_data = {
            "message": "¡Inicio de sesión exitoso!",
            "email": user.get("email", email),
            "id": user.get("user_id", user.get("id")),
            "token": user.get("token"),
            "user_type": user.get("user_type", user_type)  # Añadir user_type
        }
        return jsonify(response_data), 200
    return jsonify({"message": "¡Credenciales o tipo de usuario inválidos!"}), 401


@app.route("/api/teacher/dashboard/quizzes", methods=["GET"])
@token_required
def list_quizzes(token_info):
    """Endpoint para listar todos los quizzes creados por el profesor"""
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "Access denied! Teacher only."}), 403

    try:
        quizzes = []
        teacher_id = token_info["user_id"]

        for filename in os.listdir(QUIZ_STORAGE_PATH):
            if filename.startswith("quiz_") and filename.endswith(".json"):
                filepath = os.path.join(QUIZ_STORAGE_PATH, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    quiz_data = json.load(f)

                # Filtrar solo quizzes del profesor actual
                if quiz_data.get("created_by") == teacher_id:
                    quizzes.append({
                        "quiz_id": quiz_data["quiz_id"],
                        "title": quiz_data.get("title", "Untitled Quiz"),
                        "topic": quiz_data.get("topic", "General"),
                        "age_group": quiz_data.get("age_group", "3-5 años"),
                        "created_at": quiz_data["created_at"],
                        "questions_count": len(quiz_data.get("questions", []))
                    })

        # Ordenar por fecha de creación (más recientes primero)
        quizzes.sort(key=lambda x: x["created_at"], reverse=True)

        return jsonify({"quizzes": quizzes})

    except Exception as e:
        return jsonify({"error": f"Error listing quizzes: {str(e)}"}), 500




# --- NUEVAS RUTAS PARA LISTAR USUARIOS (SOLO PROFESORES) ---

@app.route("/api/teacher/listare", methods=["GET"])
@token_required
def list_students(token_info):
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "¡Acceso denegado! Solo para profesores."}), 403

    auth_service = AuthService(Database())
    students = auth_service.get_all_students()
    return jsonify({"students": students}), 200

@app.route("/api/teacher/listarp", methods=["GET"])
@token_required
def list_teachers(token_info):
    if token_info["user_type"] != "profesor":
        return jsonify({"message": "¡Acceso denegado! Solo para profesores."}), 403

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
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No se recibieron datos en la solicitud"}), 400
        session_id = data.get('session_id')
        user_message = data.get('message', '').strip()

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


if __name__ == "__main__":
    db = Database()
    auth = AuthService(db)
    app.run(debug=True)