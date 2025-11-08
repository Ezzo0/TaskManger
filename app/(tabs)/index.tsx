/**
 * Main Tasks Screen (Home Screen)
 *
 * The primary screen of the application where users manage their tasks.
 * Displays task list with progress tracking, input field, and task operations.
 *
 * Features:
 * - Task creation via input field
 * - Task list with completion toggle
 * - Task editing and deletion
 * - Progress tracking in header
 * - Loading state handling
 * - Error handling with user-friendly alerts
 *
 * Layout Structure:
 * - LinearGradient background
 * - Header with progress bar
 * - Task input field
 * - Scrollable task list
 */

import { createHomeStyles } from "@/assets/styles/home.styles";
import Header from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import useTasks from "@/hooks/useTasks";
import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { colors } = useTheme();
  const { tasks, toggleTask, deleteTask, updateTask } = useTasks();
  const homeStyles = createHomeStyles(colors);

  // Check if tasks are still loading (undefined means not yet initialized)
  const isLoading = tasks === undefined;

  // Show loading spinner while tasks are being initialized (For future updates when using API)
  if (isLoading) return <LoadingSpinner />;

  /**
   * Handles toggling task completion status
   *
   * Error Scenarios:
   * - Task not found (shouldn't happen in normal flow)
   * - State update failures
   *
   * @param {string} id - The unique identifier of the task to toggle
   */
  const handleToggleTask = (id: string) => {
    try {
      toggleTask(id);
    } catch (error) {
      // Log error for debugging purposes
      console.log("Error toggling Task", error);
      // Show user-friendly error message
      Alert.alert("Error", "Failed to toggle Task");
    }
  };

  /**
   * Handles permanent deletion of a task
   *
   * Note: Confirmation dialog is shown in TaskItem component before calling this
   *
   * Error Scenarios:
   * - Task not found
   * - State update failures
   *
   * @param {string} id - The unique identifier of the task to delete
   */
  const handleDeleteTask = (id: string) => {
    try {
      deleteTask(id);
    } catch (error) {
      console.log("Error deleting Task", error);
      Alert.alert("Error", "Failed to delete Task");
    }
  };

  /**
   * Handles updating a task's title/description
   *
   * Error Scenarios:
   * - Task not found
   * - Empty title (validated in TaskItem before calling)
   * - State update failures
   *
   * @param {string} id - The unique identifier of the task to update
   * @param {string} title - The new title for the task
   */
  const handleUpdateTask = (id: string, title: string) => {
    try {
      updateTask(id, title);
    } catch (error) {
      console.log("Error updating Task", error);
      Alert.alert("Error", "Failed to update Task");
    }
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={homeStyles.container}
    >
      <StatusBar barStyle={colors.statusBarStyle} />
      <SafeAreaView style={homeStyles.safeArea}>
        <Header />

        <TaskInput />

        <TaskList
          tasks={tasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
