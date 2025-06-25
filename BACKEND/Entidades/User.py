import json
import hashlib
import datetime
from operator import countOf
from os.path import curdir

import jwt
from typing import Optional, Dict, List
from dataclasses import dataclass
from functools import wraps

import psycopg2
from flask import Flask, request, jsonify
from psycopg2.extras import RealDictCursor

# Configuración
SECRET_KEY = "your-secret-key"  # Cambia esto en producción
TOKEN_EXPIRATION_MINUTES = 30

app = Flask(__name__)


@dataclass
class User:
    id: int
    nombre: str
    email: str
    password: str
    user_type: str  # 'student' o 'teacher'


class Database:
    def __init__(self, db_name="EDUCAGAME", user="postgres", host="localhost", port="5432"):
        self.conn_params = {
            "dbname": db_name,
            "user": user,
            "host": host,
            "port": port
        }
        self.init_db()

    def get_connection(self):
        return psycopg2.connect(**self.conn_params)

    def init_db(self):
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS estudiantes (
                        id SERIAL PRIMARY KEY,
                        nombre TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL
                    )
                ''')
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS profesores (
                        id SERIAL PRIMARY KEY,
                        nombre TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL
                    )
                ''')
                cursor.execute('''
                CREATE TABLE IF NOT EXISTS quizzes (
                        id UUID PRIMARY KEY,
                        user_id INTEGER NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES profesores(id),
                        nombre TEXT NOT NULL,
                        quiz_data JSONB NOT NULL,
                        created_at TIMESTAMP NOT NULL
                    )
                ''')
                cursor.execute('''
                CREATE TABLE IF NOT EXISTS estudiante_quiz (
                    estudiante_id INTEGER NOT NULL,
                    quiz_id UUID NOT NULL,
                    PRIMARY KEY (estudiante_id, quiz_id),
                    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
                    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
                )
                ''')
                cursor.execute('''
                CREATE TABLE IF NOT EXISTS estadisticas(
                    id SERIAL PRIMARY KEY,
                    quiz_id UUID NOT NULL,
                    estudiante_id INTEGER NOT NULL,
                    puntaje Integer NOT NULL,
                    FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
                    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)            
                    )        
                ''')

                conn.commit()


class AuthService:
    def __init__(self, db: Database):
        self.db = db

    def hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()

    def register_user(self, usuario: User) -> bool:
        if usuario.user_type not in ["estudiante", "profesor"]:
            return False

        table = "estudiantes" if usuario.user_type == "estudiante" else "profesores"
        password_hash = self.hash_password(usuario.password)

        try:
            with self.db.get_connection() as conn:
                with conn.cursor() as cursor:
                    cursor.execute(f'''
                        INSERT INTO {table} (nombre,email, password_hash)
                        VALUES (%s,%s,%s)
                    ''', (usuario.nombre, usuario.email, password_hash))
                    conn.commit()
                return True
        except psycopg2.IntegrityError:
            return False  # Email ya existe
        except Exception as e:
            print("Error:", e)
            return False

    def register_quiz(self, quiz_id, user_id, title, quiz_data, timestamp):
        with self.db.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    INSERT INTO quizzes (id, user_id, nombre, quiz_data, created_at)
                    VALUES (%s, %s, %s, %s, %s)
                ''', (
                    quiz_id,
                    user_id,
                    title,
                    json.dumps(quiz_data, ensure_ascii=False),
                    timestamp
                ))
                conn.commit()

    def register_quiz_toalumn(self,alumno_id,quiz_id):
        with self.db.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                INSERT INTO estudiante_quiz (estudiante_id,quiz_id)
                VALUES (%s,%s)
                ''',(
                    alumno_id,quiz_id
                ))
                conn.commit()

    def register_stadistics(self,student_id,quiz_id,puntaje):
        with self.db.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                INSERT INTO estadisticas (quiz_id,estudiante_id,puntaje)
                VALUES (%s,%s,%s)
                RETURNING id
                """,(quiz_id,student_id,puntaje))
                conn.commit()
                estadistica=cursor.fetchone()
        return estadistica[0]

    def get_stadistics_student(self,student_id)-> List[Dict]:
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("""
                SELECT quiz_id,puntaje from estadisticas 
                WHERE estudiante_id=%s
                """,(student_id,))
                return cursor.fetchall()

    def get_quiz(self,quiz_id)-> List[Dict]:
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id,user_id,nombre,quiz_data,created_at FROM quizzes WHERE id= %s",
                               (quiz_id,))
                return cursor.fetchall()

    def get_all_students(self) -> List[Dict]:
        """Obtiene una lista de todos los estudiantes registrados."""
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id, nombre, email FROM estudiantes")
                return cursor.fetchall()

    def get_all_students_id(self) -> List[Dict]:
        """Obtiene una lista de todos los estudiantes registrados."""
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id FROM estudiantes")
                return cursor.fetchall()




    def get_estudiante(self,student_id):
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id, nombre, email FROM estudiantes WHERE id= %s",
                               (student_id,))
                return cursor.fetchall()

    def get_teacher(self,teacher_id):
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id, nombre, email FROM profesores WHERE id= %s",
                               (teacher_id,))
                return cursor.fetchall()

    def count_students_for_quiz(self,quiz_id):
        with self.db.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                SELECT COUNT(*) from estudiante_quiz where quiz_id=%s
                """,(quiz_id,))
                return cursor.fetchone()[0]

    def delete_student_from_quiz(self,estudiante_id,quiz_id):
        with self.db.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                DELETE FROM estudiante_quiz WHERE estudiante_id=%s AND quiz_id=%s""", (estudiante_id,quiz_id)
                )
                conn.commit()
    def delete_quiz(self,quiz_id):
        with self.db.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                DELETE FROM quizzes where id=%s
                """,(quiz_id,))
                conn.commit()


    def get_all_teachers(self) -> List[Dict]:
        """Obtiene una lista de todos los profesores registrados."""
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id, nombre, email FROM profesores")
                return cursor.fetchall()

    def get_all_quizzes(self, user_id) -> List[Dict]:
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id,user_id,nombre,quiz_data,created_at FROM quizzes WHERE user_id= %s AND nombre LIKE %s"
                               , (user_id,"Quiz%"))
                return cursor.fetchall()

    def get_all_narratives(self, user_id) -> List[Dict]:
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT id,user_id,nombre,quiz_data,created_at FROM quizzes WHERE user_id= %s AND nombre LIKE %s"
                               , (user_id,"Narra%"))
                return cursor.fetchall()

    def get_all_quizzes_estudiante(self,user_id) -> List[Dict]:
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("""
                    SELECT estudiante_quiz.estudiante_id, estudiante_quiz.quiz_id, quizzes.nombre, quizzes.quiz_data
                    FROM estudiante_quiz
                    INNER JOIN quizzes ON estudiante_quiz.quiz_id = quizzes.id
                    WHERE estudiante_quiz.estudiante_id = %s and quizzes.nombre LIKE %s
                    """
                               , (user_id,"Qui%"))
                return cursor.fetchall()

    def get_all_narratives_estudiante(self,user_id) -> List[Dict]:
        with self.db.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("""
                    SELECT estudiante_quiz.estudiante_id, estudiante_quiz.quiz_id, quizzes.nombre, quizzes.quiz_data
                    FROM estudiante_quiz
                    INNER JOIN quizzes ON estudiante_quiz.quiz_id = quizzes.id
                    WHERE estudiante_quiz.estudiante_id = %s and quizzes.nombre LIKE %s
                    """
                               , (user_id,"Narr%"))
                return cursor.fetchall()

    def login_user(self, usuario: User) -> Optional[Dict]:
        if usuario.user_type not in ["estudiante", "profesor"]:
            return None

        table = "estudiantes" if usuario.user_type == "estudiante" else "profesores"
        password_hash = self.hash_password(usuario.password)

        with self.db.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(f'''
                    SELECT id, email, password_hash FROM {table}
                    WHERE email = %s AND password_hash = %s
                ''', (usuario.email, password_hash))
                user = cursor.fetchone()

        if user:
            return {
                "id": user[0],
                "email": user[1],
                "token": self.generate_token(user[0], usuario.user_type)
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
