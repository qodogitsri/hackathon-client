const API_BASE_URL = "http://localhost:8000";
const API_PATHS = {
  health: "/health",
  tasks: "/api/tasks",
  summary: "/api/tasks/summary",
  task: (id) => `/api/tasks/${id}`,
};

const elements = {
  status: document.querySelector("#api-status"),
  form: document.querySelector("#task-form"),
  input: document.querySelector("#task-title"),
  list: document.querySelector("#task-list"),
  empty: document.querySelector("#empty-state"),
  template: document.querySelector("#task-template"),
  filters: document.querySelectorAll(".filter-button"),
  summaryTotal: document.querySelector("#summary-total"),
  summaryOpen: document.querySelector("#summary-open"),
  summaryCompleted: document.querySelector("#summary-completed"),
};

let tasks = [];
let activeFilter = "all";
let summary = { total: 0, open: 0, completed: 0 };

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function setStatus(kind, label) {
  elements.status.className = `status status-${kind}`;
  elements.status.textContent = label;
}

function renderSummary() {
  elements.summaryTotal.textContent = summary.total;
  elements.summaryOpen.textContent = summary.open;
  elements.summaryCompleted.textContent = summary.completed;
}

function visibleTasks() {
  if (activeFilter === "open") {
    return tasks.filter((task) => !task.completed);
  }

  if (activeFilter === "done") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

function render() {
  elements.list.replaceChildren();

  const filteredTasks = visibleTasks();
  elements.empty.hidden = filteredTasks.length > 0;

  for (const task of filteredTasks) {
    const item = elements.template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector("input");
    const title = item.querySelector("span");
    const deleteButton = item.querySelector(".delete-button");

    item.classList.toggle("completed", task.completed);
    checkbox.checked = task.completed;
    title.textContent = task.title;

    checkbox.addEventListener("change", () => toggleTask(task));
    deleteButton.addEventListener("click", () => deleteTask(task));

    elements.list.append(item);
  }
}

async function loadTasks() {
  try {
    await api(API_PATHS.health);
    [tasks, summary] = await Promise.all([api(API_PATHS.tasks), api(API_PATHS.summary)]);
    setStatus("ok", "API connected");
    renderSummary();
    render();
  } catch (error) {
    setStatus("error", "API offline");
    elements.empty.hidden = false;
    elements.empty.textContent = "Start the API at http://localhost:8000.";
    console.error(error);
  }
}

async function createTask(event) {
  event.preventDefault();
  const title = elements.input.value.trim();

  if (!title) {
    return;
  }

  try {
    const task = await api(API_PATHS.tasks, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    tasks = [...tasks, task];
    summary = await api(API_PATHS.summary);
    elements.input.value = "";
    setStatus("ok", "Task added");
    renderSummary();
    render();
  } catch (error) {
    setStatus("error", "Add failed");
    console.error(error);
  }
}

async function toggleTask(task) {
  try {
    const updated = await api(API_PATHS.task(task.id), {
      method: "PATCH",
      body: JSON.stringify({ completed: !task.completed }),
    });
    tasks = tasks.map((candidate) => (candidate.id === task.id ? updated : candidate));
    summary = await api(API_PATHS.summary);
    setStatus("ok", updated.completed ? "Task done" : "Task reopened");
    renderSummary();
    render();
  } catch (error) {
    setStatus("error", "Update failed");
    console.error(error);
  }
}

async function deleteTask(task) {
  try {
    await api(API_PATHS.task(task.id), { method: "DELETE" });
    tasks = tasks.filter((candidate) => candidate.id !== task.id);
    summary = await api(API_PATHS.summary);
    setStatus("ok", "Task deleted");
    renderSummary();
    render();
  } catch (error) {
    setStatus("error", "Delete failed");
    console.error(error);
  }
}

elements.form.addEventListener("submit", createTask);

for (const button of elements.filters) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    elements.filters.forEach((filter) => {
      filter.classList.toggle("active", filter === button);
    });
    render();
  });
}

loadTasks();
