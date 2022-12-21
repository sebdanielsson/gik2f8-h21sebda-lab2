"use strict";

// Check if user prefers dark mode
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

// Follow user's system theme preference if no website theme preference is set
prefersDarkMode.addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) {
        if (event.matches) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }
});

// Theme switcher
const themeSystem = document.getElementById("theme-system");
const themeLight = document.getElementById("theme-light");
const themeDark = document.getElementById("theme-dark");

themeSystem.addEventListener("click", () => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");
});

themeLight.addEventListener("click", () => {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
});

themeDark.addEventListener("click", () => {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
});

// Create new API instance
const api = new Api("http://localhost/tasks");

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
function addTaskButton() {
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
            clearForm();
            renderTasks();
        }
    });
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    api.getAll().then((tasks) => {
        try {
            if (tasks && tasks.length === 0) {
                taskList.innerHTML = `<li class="text-center py-3 border-t border-rose-200"><span class="text-2xl">Nothing to do </span><span class="text-4xl">🤷‍♀️</span></li>`;
            } else if (tasks && tasks.length > 0) {
                tasks.forEach((task) => {
                    taskList.insertAdjacentHTML("beforeend", renderTasksHTML(task));
                });
            } else {
                taskList.innerHTML = `
                <li class="flex text-center py-3 border-t border-rose-200">
                <svg class="h-7 w-7 my-auto mr-2 dark:fill-white" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.7399 6.32717C24.3781 8.48282 24.2132 11.571 22.2453 13.5389L20.3007 15.4835C20.0078 15.7764 19.533 15.7764 19.2401 15.4835L12.5226 8.76595C12.2297 8.47306 12.2297 7.99818 12.5226 7.70529L14.4671 5.76075C16.4352 3.79268 19.5237 3.62792 21.6793 5.26646L24.7238 2.22166C25.0167 1.92875 25.4916 1.92873 25.7845 2.22161C26.0774 2.51449 26.0774 2.98936 25.7845 3.28227L22.7399 6.32717ZM19.7704 13.8925L21.1846 12.4783C22.7467 10.9162 22.7467 8.3835 21.1846 6.82141C19.6225 5.25931 17.0899 5.25931 15.5278 6.82141L14.1135 8.23562L19.7704 13.8925Z" />
                <path d="M12.7778 11.215C13.0707 11.5079 13.0707 11.9828 12.7778 12.2757L10.6514 14.402L13.5982 17.3489L15.7238 15.2234C16.0167 14.9305 16.4916 14.9305 16.7844 15.2234C17.0773 15.5163 17.0773 15.9912 16.7844 16.284L14.6589 18.4095L15.4858 19.2364C15.7787 19.5293 15.7787 20.0042 15.4858 20.2971L13.5412 22.2416C11.5732 24.2096 8.48484 24.3745 6.32918 22.7361L3.28475 25.7808C2.99187 26.0737 2.517 26.0737 2.22409 25.7808C1.93118 25.488 1.93116 25.0131 2.22404 24.7202L5.26853 21.6754C3.63025 19.5197 3.79509 16.4314 5.76306 14.4635L7.7076 12.5189C8.0005 12.226 8.47537 12.226 8.76826 12.5189L9.59072 13.3414L11.7172 11.215C12.0101 10.9221 12.485 10.9221 12.7778 11.215ZM6.83028 21.1875C8.3929 22.7431 10.9207 22.7409 12.4806 21.181L13.8948 19.7668L8.23793 14.1099L6.82372 15.5241C5.26383 17.084 5.26163 19.6117 6.81709 21.1743L6.82366 21.1808L6.83028 21.1875Z" />
                </svg>
                <span class="text-2xl text-gray-500">
                Error: Could not connect to the server.
                </span>
                </li>`;
            }
        } catch (error) {
            console.log("error", error);
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
        <summary class="group-hover:text-rose-500 dark:group-hover:text-rose-300 font-medium text-gray-700 dark:text-gray-300">${title}<br>${dueDate}</summary>
        <p class="group-hover:text-rose-400 dark:group-hover:text-rose-200 text-gray-500 dark:text-gray-100">${description}</p>
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
                        renderTasks();
                        clearForm();
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
