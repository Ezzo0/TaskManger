/**
 * Task Management Hook
 *
 * Provides centralized state management for all task operations in the application.
 * Uses React Context API to share task state across components.
 *
 * Features:
 * - CRUD operations for tasks
 * - Automatic task sorting (incomplete tasks first, then completed)
 * - Smart repositioning when toggling task completion status
 * - UUID-based task identification
 */

import * as Crypto from "expo-crypto";
import { createContext, ReactNode, useContext, useState } from "react";

/**
 * Task interface representing a single task item
 * @property {string} id - Unique identifier (UUID)
 * @property {string} title - Task description/title
 * @property {boolean} completed - Completion status
 * @property {Date} createdAt - Timestamp when task was created
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

/**
 * Context type defining all available task operations
 */
interface TaskContextType {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, title: string) => void;
  deleteTask: (id: string) => void;
  clearAllTasks: () => number;
}

const TaskContext = createContext<undefined | TaskContextType>(undefined);

/**
 * TaskProvider Component
 *
 * Wraps the application to provide task state and operations to all child components.
 * Should be placed high in the component tree (typically in root layout).
 *
 * @param {ReactNode} children - Child components that need access to task context
 */
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  /**
   * Adds a new task to the beginning of the task list
   *
   * @param {string} title - The task description
   */
  const addTask = (title: string) => {
    const newTask: Task = {
      id: Crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    // Add new task to the beginning of the list (most recent first)
    setTasks((prev) => [newTask, ...prev]);
  };

  /**
   * Toggles a task's completion status and repositions it in the list
   *
   * Business Logic:
   * - Completed tasks move to the end of the list
   * - Incomplete tasks are repositioned based on their original creation time
   * - This maintains chronological order while keeping completed tasks separate
   *
   * Algorithm:
   * 1. Toggle the completion status
   * 2. If now completed: move to end of list
   * 3. If now incomplete: reinsert based on createdAt timestamp among other incomplete tasks
   *
   * @param {string} id - The unique identifier of the task to toggle
   */
  const toggleTask = (id: string) => {
    setTasks((prev) => {
      // Step 1: Toggle the completion status of the target task
      const updatedTasks = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      // Step 2: Find the toggled task
      const toggledTask = updatedTasks.find((task) => task.id === id);
      if (!toggledTask) return prev; // Safety check: return unchanged if task not found

      // Step 3: Remove the toggled task from the array temporarily
      const otherTasks = updatedTasks.filter((task) => task.id !== id);

      // Step 4: If task is now completed, simply add it to the end
      if (toggledTask.completed) {
        return [...otherTasks, toggledTask];
      }

      // Step 5: If task is now incomplete, reposition it chronologically
      // Separate incomplete and completed tasks
      const incompleteTasks = otherTasks.filter((task) => !task.completed);
      const completedTasks = otherTasks.filter((task) => task.completed);

      // Find the correct insertion position based on creation time
      // Tasks with more recent createdAt (higher timestamp) should appear first
      let insertIndex = 0;
      for (let i = 0; i < incompleteTasks.length; i++) {
        if (
          new Date(toggledTask.createdAt).getTime() >
          new Date(incompleteTasks[i].createdAt).getTime()
        ) {
          insertIndex = i;
          break;
        }
        insertIndex = i + 1;
      }

      // Insert the task at the calculated position
      incompleteTasks.splice(insertIndex, 0, toggledTask);

      // Step 6: Return the final sorted array (incomplete first, then completed)
      return [...incompleteTasks, ...completedTasks];
    });
  };

  /**
   * Updates the title of an existing task
   *
   * @param {string} id - The unique identifier of the task to update
   * @param {string} title - The new title/description for the task
   */
  const updateTask = (id: string, title: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title } : task))
    );
  };

  /**
   * Permanently removes a task from the list
   *
   * @param {string} id - The unique identifier of the task to delete
   */
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  /**
   * Removes all tasks from the list
   * Used for the "Clear All Tasks" feature in settings
   *
   * @returns {number} The number of tasks that were deleted
   */
  const clearAllTasks = () => {
    const count = tasks.length;
    setTasks([]);
    return count;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
        clearAllTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

/**
 * Custom hook to access task management functionality
 *
 * Must be used within a component wrapped by TaskProvider.
 * Provides access to task state and all CRUD operations.
 *
 * @returns {TaskContextType} Object containing tasks array and management functions
 * @throws {Error} If used outside of TaskProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { tasks, addTask, toggleTask } = useTasks();
 *
 *   return (
 *     <button onClick={() => addTask("New task")}>
 *       Add Task
 *     </button>
 *   );
 * }
 * ```
 */
const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }

  return context;
};

export default useTasks;
