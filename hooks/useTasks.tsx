import * as Crypto from "expo-crypto";
import { createContext, ReactNode, useContext, useState } from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, title: string) => void;
  deleteTask: (id: string) => void;
  clearAllTasks: () => number;
}

const TaskContext = createContext<undefined | TaskContextType>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (title: string) => {
    const newTask: Task = {
      id: Crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    setTasks((prev) => [newTask, ...prev]); // Add to beginning of list
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      // Find the task and toggle its completed status
      const updatedTasks = prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      // Find the toggled task
      const toggledTask = updatedTasks.find((task) => task.id === id);
      if (!toggledTask) return prev;

      // Remove the toggled task from the array
      const otherTasks = updatedTasks.filter((task) => task.id !== id);

      // If task is now completed, add it to the end
      if (toggledTask.completed) {
        return [...otherTasks, toggledTask];
      }

      // If task is now incomplete, insert it based on createdAt time
      // Find the correct position among incomplete tasks
      const incompleteTasks = otherTasks.filter((task) => !task.completed);
      const completedTasks = otherTasks.filter((task) => task.completed);

      // Insert the task in the correct position based on createdAt
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

      incompleteTasks.splice(insertIndex, 0, toggledTask);

      // Return incomplete tasks first, then completed tasks
      return [...incompleteTasks, ...completedTasks];
    });
  };

  const updateTask = (id: string, title: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

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

const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }

  return context;
};

export default useTasks;
