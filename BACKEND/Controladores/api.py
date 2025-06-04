
from functools import wraps
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from BACKEND.Entidades.User import Database, AuthService

app = Flask(__name__)
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:5173"],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
    # Configuración explícita de CORS
}})  # Permitir solicitudes desde el frontend React


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

if __name__ == "__main__":
    db = Database()
    auth = AuthService(db)
    app.run(debug=True)