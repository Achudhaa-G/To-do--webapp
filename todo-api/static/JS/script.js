const API_URL = 'http://127.0.0.1:5000/tasks';

document.addEventListener('DOMContentLoaded', loadTasks);

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const task = { title, description };

    // Create a new task
    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Task created') {
            loadTasks(); // Reload the task list
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
        }
    })
    .catch(error => console.error('Error:', error));
});

// Function to load all tasks
function loadTasks() {
    fetch('http://127.0.0.1:5000/tasks')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Clear the list

            data.tasks.forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${task.title}</span>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;
                taskList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

// Function to delete a task
function deleteTask(taskId) {
    fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Task deleted') {
            loadTasks(); // Reload the task list
        }
    })
    .catch(error => console.error('Error:', error));
}
