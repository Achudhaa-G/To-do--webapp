import sqlite3
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Database initialization
def init_db():
    with sqlite3.connect("database.db") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                completed INTEGER DEFAULT 0
            )
        """)
        conn.commit()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/tasks", methods=["GET"])
def get_tasks():
    with sqlite3.connect("database.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, description, completed FROM tasks")
        tasks = [{"id": row[0], "title": row[1], "description": row[2], "completed": bool(row[3])} for row in cursor.fetchall()]
    return jsonify({"tasks": tasks})

@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()
    with sqlite3.connect("database.db") as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO tasks (title, description) VALUES (?, ?)", (data["title"], data["description"]))
        conn.commit()
        task_id = cursor.lastrowid
    return jsonify({"message": "Task created", "id": task_id}), 201

@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    with sqlite3.connect("database.db") as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tasks WHERE id = ?", (id,))
        conn.commit()
    return jsonify({"message": "Task deleted"}), 200

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
