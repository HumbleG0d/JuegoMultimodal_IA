import sqlite3
import hashlib
import datetime
import jwt
from typing import Optional, Dict, List
from dataclasses import dataclass
from functools import wraps
from flask import Flask, request, jsonify

# Configuración
SECRET_KEY = "your-secret-key"  # Cambia esto en producción
TOKEN_EXPIRATION_MINUTES = 30

app = Flask(__name__)


@dataclass
class User:
    id: int
    nombre: str
    email: str
    password_hash: str
    user_type: str  # 'student' o 'teacher'


class Database:
    def __init__(self, db_name: str = "users.db"):
        self.db_name = db_name
        self.init_db()

    def init_db(self):
        with sqlite3.connect(self.db_name) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS estudiantes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS profesores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL
                )
            ''')
            conn.commit()

    def get_connection(self):
        return sqlite3.connect(self.db_name)


class AuthService:
    def __init__(self, db: Database):
        self.db = db

    def hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()

    def register_user(self, email: str, nombre: str, password: str, user_type: str) -> bool:
        if user_type not in ["estudiante", "profesor"]:
            return False

        table = "estudiantes" if user_type == "estudiante" else "profesores"
        password_hash = self.hash_password(password)

        try:
            with self.db.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(f'''
                    INSERT INTO {table} (nombre,email, password_hash)
                    VALUES (?, ?,?)
                ''', (nombre, email, password_hash))
                conn.commit()
                return True
        except sqlite3.IntegrityError:
            return False  # Email ya existe

    def get_all_students(self) -> List[Dict]:
        """Obtiene una lista de todos los estudiantes registrados."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, nombre, email FROM estudiantes")
            students = cursor.fetchall()
            return [{"id": s[0], "nombre": s[1], "email": s[2]} for s in students]

    def get_all_teachers(self) -> List[Dict]:
        """Obtiene una lista de todos los profesores registrados."""
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, nombre, email FROM profesores")
            teachers = cursor.fetchall()
            return [{"id": t[0], "nombre": t[1], "email": t[2]} for t in teachers]

    def login_user(self, email: str, password: str, user_type: str) -> Optional[Dict]:
        if user_type not in ["estudiante", "profesor"]:
            return None

        table = "estudiantes" if user_type == "estudiante" else "profesores"
        password_hash = self.hash_password(password)

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f'''
                SELECT id, email, password_hash FROM {table}
                WHERE email = ? AND password_hash = ?
            ''', (email, password_hash))
            user = cursor.fetchone()

        if user:
            return {
                "id": user[0],
                "email": user[1],
                "token": self.generate_token(user[0], user_type)
            }
        return None

    def generate_token(self, user_id: int, user_type: str) -> str:
        payload = {
            "user_id": user_id,
            "user_type": user_type,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=TOKEN_EXPIRATION_MINUTES)
        }

        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    def verify_token(self, token: str) -> Optional[Dict]:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            return {
                "user_id": payload["user_id"],
                "user_type": payload["user_type"]
            }
        except jwt.ExpiredSignatureError:
            return None  # Token expirado
        except jwt.InvalidTokenError:
            return None  # Token inválido


# Decorador para proteger rutas
