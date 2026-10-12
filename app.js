import { addTask, advanceTask, deleteTask, filterByStatus, countByStatus, } from "./model.js";
const STORAGE_KEY = "typetasks_items_v1";
const DEFAULT_TASKS = [
    { id: 1, title: "Configure strict TypeScript tsconfig", status: "done" },
    { id: 2, title: "Implement TypeTasks pure data model", status: "done" },
    { id: 3, title: "Build responsive and type-safe UI layer", status: "in-progress" },
    { id: 4, title: "Deploy application and verify tests", status: "todo" },
];
function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return DEFAULT_TASKS;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed;
        }
    }
    catch (error) {
        console.warn("Failed to load tasks from localStorage:", error);
    }
    return DEFAULT_TASKS;
}
function saveTasks(taskList) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(taskList));
    }
    catch (error) {
        console.warn("Failed to save tasks to localStorage:", error);
    }
}
let tasks = loadTasks();
let currentFilter = "all";
// ============================================================================
// DOM Element Selection (Strictly Checked)
// ============================================================================
const titleInput = document.getElementById("title");
const addBtn = document.getElementById("add");
const listEl = document.getElementById("list");
const chipBtns = document.querySelectorAll(".chip");
const emptyStateEl = document.getElementById("empty-state");
const emptyDescEl = document.getElementById("empty-desc");
const totalCountEl = document.getElementById("total-count");
const completedCountEl = document.getElementById("completed-count");
const countAllEl = document.getElementById("count-all");
const countTodoEl = document.getElementById("count-todo");
const countProgEl = document.getElementById("count-in-progress");
const countDoneEl = document.getElementById("count-done");
// ============================================================================
// Helpers
// ============================================================================
function formatStatus(status) {
    switch (status) {
        case "todo":
            return "To Do";
        case "in-progress":
            return "In Progress";
        case "done":
            return "Done";
    }
}
function updateBadgeCounts() {
    const total = tasks.length;
    const todoCount = countByStatus(tasks, "todo");
    const progCount = countByStatus(tasks, "in-progress");
    const doneCount = countByStatus(tasks, "done");
    if (countAllEl)
        countAllEl.textContent = String(total);
    if (countTodoEl)
        countTodoEl.textContent = String(todoCount);
    if (countProgEl)
        countProgEl.textContent = String(progCount);
    if (countDoneEl)
        countDoneEl.textContent = String(doneCount);
    if (totalCountEl)
        totalCountEl.textContent = String(total);
    if (completedCountEl)
        completedCountEl.textContent = String(doneCount);
}
// ============================================================================
// Render Engine
// ============================================================================
function render() {
    if (!listEl)
        return;
    saveTasks(tasks);
    updateBadgeCounts();
    // Type-safe filter resolution:
    // "all" displays every task; specific statuses use filterByStatus()
    const filteredTasks = currentFilter === "all" ? tasks : filterByStatus(tasks, currentFilter);
    listEl.innerHTML = "";
    if (filteredTasks.length === 0) {
        if (emptyStateEl)
            emptyStateEl.classList.remove("hidden");
        if (emptyDescEl) {
            emptyDescEl.textContent =
                currentFilter === "all"
                    ? "Add a new task above to get started."
                    : `No tasks currently marked as "${formatStatus(currentFilter)}".`;
        }
    }
    else {
        if (emptyStateEl)
            emptyStateEl.classList.add("hidden");
        filteredTasks.forEach((task) => {
            const li = document.createElement("li");
            li.className = `task ${task.status === "done" ? "is-done" : ""}`;
            // Left group: Title
            const titleGroup = document.createElement("div");
            titleGroup.className = "task-title-group";
            const titleSpan = document.createElement("span");
            titleSpan.className = "task-title";
            titleSpan.textContent = task.title; // Safe against XSS
            titleGroup.appendChild(titleSpan);
            // Right group: Status badge & Actions
            const controlsGroup = document.createElement("div");
            controlsGroup.className = "task-controls";
            const badge = document.createElement("span");
            badge.className = `badge ${task.status}`;
            badge.textContent = formatStatus(task.status);
            controlsGroup.appendChild(badge);
            const actions = document.createElement("span");
            actions.className = "actions";
            // Advance button (shown when task is not yet done)
            if (task.status !== "done") {
                const advanceBtn = document.createElement("button");
                advanceBtn.className = "advance-btn";
                advanceBtn.type = "button";
                advanceBtn.title = "Advance task status";
                advanceBtn.textContent =
                    task.status === "todo" ? "Start →" : "Complete →";
                advanceBtn.addEventListener("click", () => {
                    tasks = advanceTask(tasks, task.id);
                    render();
                });
                actions.appendChild(advanceBtn);
            }
            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.type = "button";
            deleteBtn.title = "Delete task";
            deleteBtn.setAttribute("aria-label", `Delete task ${task.title}`);
            deleteBtn.textContent = "✕";
            deleteBtn.addEventListener("click", () => {
                tasks = deleteTask(tasks, task.id);
                render();
            });
            actions.appendChild(deleteBtn);
            controlsGroup.appendChild(actions);
            li.appendChild(titleGroup);
            li.appendChild(controlsGroup);
            listEl.appendChild(li);
        });
    }
}
// ============================================================================
// Event Handlers
// ============================================================================
function handleAddTask() {
    if (!titleInput)
        return;
    const title = titleInput.value.trim();
    if (!title)
        return;
    tasks = addTask(tasks, title);
    titleInput.value = "";
    titleInput.focus();
    render();
}
if (addBtn) {
    addBtn.addEventListener("click", handleAddTask);
}
if (titleInput) {
    titleInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTask();
        }
    });
}
chipBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        chipBtns.forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        const rawFilter = btn.getAttribute("data-filter");
        if (rawFilter === "all" ||
            rawFilter === "todo" ||
            rawFilter === "in-progress" ||
            rawFilter === "done") {
            currentFilter = rawFilter;
        }
        else {
            currentFilter = "all";
        }
        render();
    });
});
// Initial Render
render();
//# sourceMappingURL=app.js.map