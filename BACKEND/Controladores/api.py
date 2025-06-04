import json
import os
import uuid
from datetime import datetime
from functools import wraps
from flask_cors import CORS
from flask import Flask, request, jsonify
from Entidades.User import Database, AuthService

from Entidades.apitoIA import call_groq_api

app = Flask(__name__)
CORS(app)
# CORS(app, resources={r"/*": {"origins": "http://localhost:4000", "supports_credentials": True}})
QUIZ_STORAGE_PATH = "generated_quizzes"
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"  # URL de la API de DeepSeek

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
            "quiz_id": quiz_id,
            "created_by": token_info["user_id"],
            "created_at": timestamp,
            "original_prompt": user_prompt,
            **quiz_response
        }

        # Guardar quiz en archivo
        filename = f"quiz_{quiz_id}.json"
        filepath = os.path.join(QUIZ_STORAGE_PATH, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(quiz_data, f, ensure_ascii=False, indent=2)

        return jsonify({
            "success": True,
            "quiz_id": quiz_id,
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
    data = request.get_json()
    email = data.get("email")
    nombre = data.get("nombre")
    password = data.get("password")
    user_type = data.get("user_type")

    if not email or not password or not user_type :
        return jsonify({"message": "Missing required fields!"}), 400

    if user_type!="estudiante" and user_type!="profesor":
        return jsonify(({"message": "Solo existen dos tipos de usuarios, estudiante o profesores"}))

    auth_service = AuthService(Database())
    if auth_service.register_user(email,nombre, password, user_type):
        return jsonify({"message": "User registered successfully!"}), 201
    return jsonify({"message": "Email already exists!"}), 400


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type")

    if not email or not password or not user_type:
        return jsonify({"message": "Missing required fields!"}), 400

    auth_service = AuthService(Database())
    user = auth_service.login_user(email, password, user_type)
    if user:
        return jsonify({"message": "Login successful!", "user": user}), 200
    return jsonify({"message": "Invalid credentials or user type!"}), 401


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


# Ejemplo de uso
if __name__ == "__main__":
    db = Database()
    auth = AuthService(db)
    # Registro de usuarios
    # Ejecutar la aplicación Flask
    app.run(debug=True)