from functools import wraps

from flask import Flask, request, jsonify

from JuegoMultimodal_IA.BACKEND.Entidades.User import Database, AuthService
app = Flask(__name__)


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
    nombre=data.get("nombre")
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