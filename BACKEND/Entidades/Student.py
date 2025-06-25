import sqlite3
import json

from JuegoMultimodal_IA.BACKEND.Entidades.User import User


class Student(User):
    def __init__(self, email, password, student_id=None):
        super().__init__(email, password)
        self.student_id = student_id or f"S-{self.user_id[:8]}"
        self.quizzes_taken = []

    def save_to_db(self):
        """Save student data, including parent user data, to the database."""
        super().save_to_db()
        conn = sqlite3.connect('quiz_app.db')
        c = conn.cursor()
        c.execute('INSERT INTO students (student_id, user_id) VALUES (?, ?)',
                  (self.student_id, self.user_id))
        conn.commit()
        conn.close()

    def take_quiz(self, quiz_id, score, questions):
        """Record a quiz taken by the student."""
        self.quizzes_taken.append({
            'quiz_id': quiz_id,
            'score': score,
            'questions': questions
        })
        conn = sqlite3.connect('quiz_app.db')
        c = conn.cursor()
        c.execute('UPDATE quizzes SET score = ? WHERE quiz_id = ? AND user_id = ?',
                  (score, quiz_id, self.user_id))
        conn.commit()
        conn.close()

    def get_quiz_history(self):
        """Retrieve the student's quiz history from the database."""
        conn = sqlite3.connect('quiz_app.db')
        c = conn.cursor()
        c.execute('SELECT quiz_id, subject, difficulty, questions, score, created_at FROM quizzes WHERE user_id = ?',
                  (self.user_id,))
        quizzes = c.fetchall()
        conn.close()
        return [
            {
                'quiz_id': quiz[0],
                'subject': quiz[1],
                'difficulty': quiz[2],
                'questions': json.loads(quiz[3]),
                'score': quiz[4],
                'created_at': quiz[5]
            } for quiz in quizzes
        ]

    def to_dict(self):
        """Return student data as a dictionary."""
        base_dict = super().to_dict()
        base_dict.update({
            'student_id': self.student_id,
            'quizzes_taken': self.quizzes_taken
        })
        return base_dict
