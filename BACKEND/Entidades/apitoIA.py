import sqlite3
import uuid
from contextlib import contextmanager

from groq import Groq
import json

GROQ_API_KEY = "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"  # Configura tu API key de Groq
QUIZ_STORAGE_PATH = "generated_quizzes"
groq_client = Groq(api_key=GROQ_API_KEY)
DATABASE_PATH = "quiz_database.db"



def call_groq_api(system_prompt, user_prompt):
    """Función para llamar a la API de Groq"""
    try:
        # Usar el modelo más rápido de Groq
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",  # Modelo recomendado para tareas educativas
            temperature=0.7,
            max_tokens=30000,
            top_p=1,
            stream=False
        )

        content = chat_completion.choices[0].message.content
        print(content)
        print(type(content))
        print("gaa")
        # Parsear el JSON de respuesta
        quiz_json = json.loads(content)
        print(quiz_json)
        return quiz_json

    except json.JSONDecodeError as e:
        print(f"Error: La IA no devolvió un JSON válido: {e}")
        return None
    except Exception as e:
        print(f"Error en la API de Groq: {e}")
        return None


@contextmanager
def get_db_connection():
    """Context manager para conexiones de base de datos"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Para acceder a columnas por nombre
    try:
        yield conn
    finally:
        conn.close()

