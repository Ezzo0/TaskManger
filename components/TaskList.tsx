/**
 * TaskList Component
 *
 * Renders a scrollable list of tasks using FlatList for optimal performance.
 *
 * Features:
 * - Efficient rendering with FlatList
 * - Empty state when no tasks exist
 * - Automatic scrolling support
 * - Optimized re-renders with key extraction
 *
 * Props:
 * @param {Task[]} tasks - Array of task objects to display
 * @param {Function} onToggle - Callback when task completion is toggled
 * @param {Function} onDelete - Callback when task is deleted
 * @param {Function} onUpdate - Callback when task title is updated
 */

import { createHomeStyles } from "@/assets/styles/home.styles";
import EmptyState from "@/components/EmptyState";
import TaskItem from "@/components/TaskItem";
import { Task } from "@/hooks/useTasks";
import useTheme from "@/hooks/useTheme";
import { FlatList } from "react-native";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}

const TaskList = ({ tasks, onToggle, onDelete, onUpdate }: TaskListProps) => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  // Render function for each task item
  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={onToggle}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderTaskItem}
      keyExtractor={(item) => item.id}
      style={homeStyles.todoList}
      contentContainerStyle={homeStyles.todoListContent}
      ListEmptyComponent={<EmptyState />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default TaskList;
