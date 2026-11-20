const STORAGE_KEY = "taskflow_tasks_v2";
let tasks = loadTasks();
let currentFilter = "all";
let editingId = null;

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors
  }
}

function addTask(text) {
  const clean = text.trim();
  if (!clean) return;
  tasks.unshift({
    id: Date.now().toString(),
    text: clean,
    completed: false
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTasks();
  render();
}

function deleteTask(id) {
  if (editingId === id) editingId = null;
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function startEdit(id) {
  editingId = id;
  render();
  const input = document.querySelector(`.edit-input[data-id="${id}"]`);
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

function saveEdit(id, value) {
  const clean = value.trim();
  if (clean) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, text: clean } : t));
    saveTasks();
  }
  editingId = null;
  render();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

function updateCounter() {
  const remaining = tasks.filter((t) => !t.completed).length;
  taskCounter.textContent = `${remaining} left`;
}

function render() {
  updateCounter();
  const visibleTasks = getFilteredTasks();
  taskList.innerHTML = "";

  if (visibleTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent =
      currentFilter === "all"
        ? "No tasks yet — add your first task above!"
        : `No ${currentFilter} tasks right now.`;
    taskList.appendChild(empty);
    return;
  }

  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));
    left.appendChild(checkbox);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    if (editingId === task.id) {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "edit-input";
      editInput.value = task.text;
      editInput.dataset.id = task.id;
      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") saveEdit(task.id, editInput.value);
        if (e.key === "Escape") {
          editingId = null;
          render();
        }
      });

      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.className = "btn btn-save";
      saveBtn.textContent = "Save";
      saveBtn.addEventListener("click", () => saveEdit(task.id, editInput.value));

      left.appendChild(editInput);
      actions.appendChild(saveBtn);
    } else {
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn btn-edit";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => startEdit(task.id));

      left.appendChild(span);
      actions.appendChild(editBtn);
    }

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-delete";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteTask(task.id));
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    editingId = null;
    render();
  });
});

clearCompletedBtn.addEventListener("click", clearCompleted);

render();