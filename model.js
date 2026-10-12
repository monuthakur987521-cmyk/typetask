/**
 * TypeTasks - Model & Types
 * Part 1: TypeScript Data Model Layer
 *
 * Provides immutable state operations and strict type safety for the task tracking engine.
 */
// ============================================================================
// 2. Required Operations (Pure & Immutable)
// ============================================================================
/**
 * Appends a new task with status "todo" and an auto-incremented unique ID.
 * Returns a new array without mutating the input tasks array.
 *
 * @param tasks - The current task array.
 * @param title - The title of the task to add.
 * @returns A new Task array containing the newly added task.
 */
export function addTask(tasks, title) {
    const nextId = tasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;
    const newTask = {
        id: nextId,
        title,
        status: "todo",
    };
    return [...tasks, newTask];
}
/**
 * Returns a new array with the target task's status updated to "done".
 * Preserves all other tasks unchanged.
 *
 * @param tasks - The current task array.
 * @param id - The ID of the task to complete.
 * @returns A new Task array with the completed task.
 */
export function completeTask(tasks, id) {
    return tasks.map((task) => task.id === id ? { ...task, status: "done" } : task);
}
/**
 * Returns a new array containing only tasks matching the specified status.
 *
 * @param tasks - The current task array.
 * @param status - The TaskStatus to filter by.
 * @returns A filtered array of tasks.
 */
export function filterByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
}
// ============================================================================
// 3. Custom Extra Operations (Originality Requirement)
// ============================================================================
/**
 * Removes a task by its ID without mutating the original array.
 *
 * @param tasks - The current task array.
 * @param id - The ID of the task to remove.
 * @returns A new Task array excluding the specified task.
 */
export function deleteTask(tasks, id) {
    return tasks.filter((task) => task.id !== id);
}
/**
 * Moves a task sequentially through its lifecycle:
 * "todo" -> "in-progress" -> "done"
 * Tasks already marked "done" remain "done".
 *
 * @param tasks - The current task array.
 * @param id - The ID of the task to advance.
 * @returns A new Task array with the target task advanced.
 */
export function advanceTask(tasks, id) {
    const nextStatusMap = {
        todo: "in-progress",
        "in-progress": "done",
        done: "done",
    };
    return tasks.map((task) => task.id === id ? { ...task, status: nextStatusMap[task.status] } : task);
}
/**
 * Computes the total count of tasks in a given status.
 *
 * @param tasks - The current task array.
 * @param status - The TaskStatus to count.
 * @returns Total count of matching tasks.
 */
export function countByStatus(tasks, status) {
    return filterByStatus(tasks, status).length;
}
// ============================================================================
// 4. Type Safety Proof Section (Compile-Time Verification)
// ============================================================================
// The commented-out test cases below prove that TypeScript's compiler (`tsc`)
// strictly prevents bad inputs at compile time.
/*
// [FAIL CASE 1] Missing required 'status' property on Task interface:
// Compile Error: TS2739: Type '{ id: number; title: string; }' is missing the following
// properties from type 'Task': status
const invalidTaskMissingStatus: Task = {
  id: 1,
  title: "Build frontend",
};

// [FAIL CASE 2] Assigning 'id' as string instead of number:
// Compile Error: TS2322: Type 'string' is not assignable to type 'number'.
const invalidTaskIdType: Task = {
  id: "101",
  title: "Deploy pipeline",
  status: "todo",
};

// [FAIL CASE 3] Passing invalid status string ("finished") to filterByStatus:
// Compile Error: TS2345: Argument of type '"finished"' is not assignable to parameter of type 'TaskStatus'.
// Only "todo" | "in-progress" | "done" are accepted.
const testTasks: Task[] = [];
const invalidFiltered = filterByStatus(testTasks, "finished");

// [FAIL CASE 4] Assigning unknown status literal directly to TaskStatus:
// Compile Error: TS2322: Type '"archived"' is not assignable to type 'TaskStatus'.
const invalidStatus: TaskStatus = "archived";

// [FAIL CASE 5] Passing invalid argument type to deleteTask:
// Compile Error: TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
deleteTask(testTasks, "not-a-number");
*/
//# sourceMappingURL=model.js.map