document.addEventListener('DOMContentLoaded', function () {
    // Ensure the DOM is fully loaded before running scripts
    const taskForm = document.getElementById('taskForm');
    const tasksContainer = document.getElementById('tasks');

    if (taskForm) {
        taskForm.addEventListener('submit', handleFormSubmit);
    }

    if (tasksContainer) {
        loadTasks();
    }
});

const API_URL = '/tasks';

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');

    if (!titleInput || !descriptionInput) {
        console.error("Form elements not found.");
        return;
    }

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        alert("Task title cannot be empty!");
        return;
    }

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to add task.");
            }
            return response.json();
        })
        .then(() => {
            titleInput.value = ''; // Clear the title input
            descriptionInput.value = ''; // Clear the description input
            loadTasks(); // Reload the task list
        })
        .catch(error => {
            console.error("Error adding task:", error);
            alert("An error occurred while adding the task. Please try again.");
        });
}

// Function to load all tasks
function loadTasks() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch tasks.");
            }
            return response.json();
        })
        .then(data => {
            const tasksContainer = document.getElementById('tasks');

            if (!tasksContainer) {
                console.error("Tasks container not found.");
                return;
            }

            tasksContainer.innerHTML = ''; // Clear existing tasks

            if (data.tasks.length === 0) {
                tasksContainer.innerHTML = `<p>No tasks available. Add a new task!</p>`;
                return;
            }

            data.tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                taskItem.innerHTML = `
                    <span>${sanitizeHTML(task.title)}</span>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                `;
                tasksContainer.appendChild(taskItem);
            });
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
            alert("An error occurred while fetching tasks. Please try again.");
        });
}

// Function to delete a task
function deleteTask(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete task.");
            }
            loadTasks(); // Reload the task list
        })
        .catch(error => {
            console.error("Error deleting task:", error);
            alert("An error occurred while deleting the task. Please try again.");
        });
}

// Utility function to sanitize HTML input/output
function sanitizeHTML(str) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
}
