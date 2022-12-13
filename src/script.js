"use strict";

// Show loading spinner
function showLoading() {
    loadingSpinner.classList.remove("hidden");
    console.log("showLoading");
}

// Hide loading spinner
function hideLoading() {
    loadingSpinner.classList.add("hidden");
    console.log("hideLoading");
}

// Create new API instance
const api = new Api("http://localhost:3000/tasks");

// Load tasks on page load
window.addEventListener("load", () => {
    renderTasks();
});

// Validate fields
taskForm.titleField.addEventListener("input", (e) => validateForm(e.target));
taskForm.titleField.addEventListener("blur", (e) => validateForm(e.target));

let titleValid = false;
function validateForm(field) {
    if (field.value.length > 0) {
        if (titleWarning) {
            titleWarning.style.display = "none";
        }
        titleValid = true;
    } else {
        if (titleWarning) {
            titleWarning.style.display = "block";
        }
        titleValid = false;
    }
}

// Submit form
taskForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
    e.preventDefault();
    if (titleValid) {
        const newTask = {
            title: taskForm.titleField.value,
            description: taskForm.descriptionField.value,
            dueDate: taskForm.dueDateField.value,
            completed: false,
        };
        addTask(newTask);
    } else {
        console.log("Form is invalid");
    }
}

// Add task
function addTask(newTask) {
    api.create(newTask).then((task) => {
        if (task) {
            renderTasks();
            clearForm();
        }
    });
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    api.getAll().then((tasks) => {
        if (tasks.length === 0) {
            taskList.innerHTML = `<li class="text-center py-3 border-t border-rose-200"><span class="text-3xl">Nothing to do </span><span class="text-6xl">🤷‍♀️</span></li>`;
        } else {
            tasks.forEach((task) => {
                taskList.insertAdjacentHTML("beforeend", renderTasksHTML(task));
            });
        }
    });
}

function renderTasksHTML({ id, title, description, dueDate, completed }) {
    let html = `
        <li id="task_${id}" class="taskItem group flex flex-col gap-6 py-3 border-t border-rose-200">
        <div class="flex gap-3 items-start">
        <div class="flex h-5 items-center">
    `;
    !completed && (html += `<input onchange="updateCompletion(${id}, this)" name="completed" type="checkbox" title="Completed" class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />`);
    completed && (html += `<input onchange="updateCompletion(${id}, this)" name="completed" type="checkbox" title="Completed" checked class="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />`);
    html += `
        </div>
        <details open class="w-full text-sm">
        <summary class="group-hover:text-rose-500 font-medium text-gray-700">${title}<br>${dueDate}</summary>
        <p class="group-hover:text-rose-400 text-gray-500">${description}</p>
        </details>
        <button onclick="editTaskButton(${id})" class="editButton h-7 px-3 text-sm text-blue-100 transition-colors duration-150 bg-yellow-500 hover:bg-yellow-600 rounded-lg">Edit</button>
        <button onclick="deleteTask(${id})" class="deleteButton h-7 px-3 text-sm text-red-100 transition-colors duration-150 bg-red-600 hover:bg-red-800 rounded-lg">Delete</button>
        </div>
        </li>
        `;
    return html;
}

// Add event listener to edit button
function editTaskButton(id) {
    api.get(id).then((task) => {
        if (task) {
            // Show update button and cancel button, hide add button
            taskForm.updateButton.classList.remove("hidden");
            taskForm.cancelUpdateButton.classList.remove("hidden");
            taskForm.addButton.classList.add("hidden");

            // Disable all edit buttons
            const editButtons = document.querySelectorAll(".editButton");
            editButtons.forEach((button) => {
                button.disabled = true;
                button.classList.add("cursor-not-allowed");
                button.classList.add("bg-gray-400");
                button.classList.add("hover:bg-gray-400");
            });

            // Fill form with task data
            taskForm.titleField.value = task.title;
            taskForm.descriptionField.value = task.description;
            taskForm.dueDateField.value = task.dueDate;

            // Add event listener to update button
            taskForm.updateButton.onclick = () => {
                const updatedTask = {
                    title: taskForm.titleField.value,
                    description: taskForm.descriptionField.value,
                    dueDate: taskForm.dueDateField.value,
                };

                // Show update button and cancel button, hide add button
                taskForm.updateButton.classList.add("hidden");
                taskForm.cancelUpdateButton.classList.add("hidden");
                taskForm.addButton.classList.remove("hidden");

                // Task updated successfully
                api.update(id, updatedTask).then((task) => {
                    if (task) {
                        console.log("Task updated successfully" + task);
                        renderTasks();
                        clearForm();
                    }
                });
            };
        }
    });
}

// Update task form
function updateTask(id) {
    api.get(id).then((task) => {
        if (task) {
            taskForm.titleField.value = task.title;
            taskForm.descriptionField.value = task.description;
            taskForm.dueDateField.value = task.dueDate;
            taskForm.updateButton.classList.add("hidden");
            taskForm.cancelUpdateButton.classList.add("hidden");
            taskForm.addButton.classList.remove("hidden");

            taskForm.updateButton.onclick = () => {
                const updatedTask = {
                    title: taskForm.titleField.value,
                    description: taskForm.descriptionField.value,
                    dueDate: taskForm.dueDateField.value,
                };

                // Task updated successfully
                api.update(id, updatedTask).then((task) => {
                    if (task) {
                        renderTasks();
                        clearForm();
                        taskForm.addButton.classList.remove("hidden");
                        taskForm.submitButton.onclick = onSubmit;
                        taskForm.cancelUpdateButton.remove();

                        // Enable edit buttons
                        const editButtons = document.querySelectorAll(".editButton");
                        editButtons.forEach((button) => {
                            button.disabled = false;
                            button.classList.remove("cursor-not-allowed");
                            button.classList.remove("bg-gray-400");
                            button.classList.remove("hover:bg-gray-400");
                        });
                    }
                });
            };
        }
    });
}

function cancelUpdate() {
    clearForm();
    taskForm.updateButton.classList.add("hidden");
    taskForm.cancelUpdateButton.classList.add("hidden");
    taskForm.addButton.classList.remove("hidden");

    // Enable edit buttons
    const editButtons = document.querySelectorAll(".editButton");
    editButtons.forEach((button) => {
        button.disabled = false;
        button.classList.remove("cursor-not-allowed");
        button.classList.remove("bg-gray-400");
        button.classList.remove("hover:bg-gray-400");
    });
}

// Update completion
function updateCompletion(id, checkbox) {
    api.get(id).then((task) => {
        if (task) {
            const updatedTask = {
                completed: checkbox.checked,
            };
            api.update(id, updatedTask).then((task) => {
                if (task) {
                    renderTasks();
                }
            });
        }
    });
}

// Delete task
function deleteTask(id) {
    api.remove(id).then((response) => {
        if (response.status === 404) {
            console.log("Error deleting task.");
        } else {
            console.log(response);
            renderTasks();
        }
    });
}

// Clear form
function clearForm() {
    taskForm.titleField.value = "";
    taskForm.descriptionField.value = "";
    taskForm.dueDateField.value = "";
}
