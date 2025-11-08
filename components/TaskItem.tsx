/**
 * TaskItem Component
 *
 * Renders a single task item with full CRUD capabilities.
 *
 * Features:
 * - Checkbox for completion toggle
 * - Inline editing mode
 * - Delete with confirmation dialog
 * - Visual feedback for completed tasks (strikethrough, opacity)
 * - Gradient styling for buttons
 *
 * States:
 * - Normal: Display mode with edit/delete buttons
 * - Editing: Inline edit mode with save/cancel buttons
 *
 * Props:
 * @param {Task} task - The task object to display
 * @param {Function} onToggle - Callback when checkbox is clicked
 * @param {Function} onDelete - Callback when delete is confirmed
 * @param {Function} onUpdate - Callback when edit is saved
 */

import { createHomeStyles } from "@/assets/styles/home.styles";
import { Task } from "@/hooks/useTasks";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onUpdate }: TaskItemProps) => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  // Edit mode state management
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  /**
   * Enters edit mode and populates the input with current task title
   */
  const handleEditStart = () => {
    setEditText(task.title);
    setIsEditing(true);
  };

  /**
   * Saves the edited task title
   *
   * Validation: Ensures title is not empty after trimming
   * Side effects: Exits edit mode on success, clears edit text
   */
  const handleSaveEdit = () => {
    if (editText.trim()) {
      try {
        onUpdate(task.id, editText.trim());
        setIsEditing(false);
        setEditText("");
      } catch (error) {
        console.log("Error updating Task", error);
        Alert.alert("Error", "Failed to update Task");
      }
    } else {
      Alert.alert("Error", "Task title cannot be empty");
    }
  };

  /**
   * Cancels edit mode without saving changes
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText("");
  };

  /**
   * Shows confirmation dialog before deleting task
   *
   * User Experience: Requires explicit confirmation to prevent accidental deletion
   */
  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this Task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(task.id),
      },
    ]);
  };

  return (
    <View style={homeStyles.todoItemWrapper}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={homeStyles.todoItem}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={homeStyles.checkbox}
          activeOpacity={0.7}
          onPress={() => onToggle(task.id)}
        >
          <LinearGradient
            colors={
              task.completed ? colors.gradients.success : colors.gradients.muted
            }
            style={[
              homeStyles.checkboxInner,
              {
                borderColor: task.completed ? "transparent" : colors.border,
              },
            ]}
          >
            {task.completed && (
              <Ionicons name="checkmark" size={18} color="#fff" />
            )}
          </LinearGradient>
        </TouchableOpacity>

        {isEditing ? (
          <View style={homeStyles.editContainer}>
            <TextInput
              style={homeStyles.editInput}
              value={editText}
              onChangeText={setEditText}
              autoFocus
              multiline
              placeholder="Edit your Task..."
              placeholderTextColor={colors.textMuted}
            />
            <View style={homeStyles.editButtons}>
              <TouchableOpacity onPress={handleSaveEdit} activeOpacity={0.8}>
                <LinearGradient
                  colors={colors.gradients.success}
                  style={homeStyles.editButton}
                >
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={homeStyles.editButtonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.8}>
                <LinearGradient
                  colors={colors.gradients.muted}
                  style={homeStyles.editButton}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                  <Text style={homeStyles.editButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={homeStyles.todoTextContainer}>
            <Text
              style={[
                homeStyles.todoText,
                task.completed && {
                  textDecorationLine: "line-through",
                  color: colors.textMuted,
                  opacity: 0.6,
                },
              ]}
            >
              {task.title}
            </Text>

            <View style={homeStyles.todoActions}>
              <TouchableOpacity onPress={handleEditStart} activeOpacity={0.8}>
                <LinearGradient
                  colors={colors.gradients.warning}
                  style={homeStyles.actionButton}
                >
                  <Ionicons name="pencil" size={14} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
                <LinearGradient
                  colors={colors.gradients.danger}
                  style={homeStyles.actionButton}
                >
                  <Ionicons name="trash" size={14} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

export default TaskItem;
