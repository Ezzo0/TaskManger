/**
 * TaskInput Component
 *
 * Provides an input field for creating new tasks with:
 * - Text input with placeholder
 * - Add button with gradient styling
 * - Input validation (trims whitespace)
 * - Disabled state when input is empty
 * - Keyboard submit handling (Enter/Return key)
 *
 * Validation:
 * - Only allows non-empty tasks (after trimming whitespace)
 * - Button is visually disabled when input is empty
 * - Clears input after successful task creation
 */

import { createHomeStyles } from "@/assets/styles/home.styles";
import useTasks from "@/hooks/useTasks";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";

const TodoInput = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);

  const [newTodo, setNewTodo] = useState("");
  const { addTask } = useTasks();

  /**
   * Handles adding a new task
   *
   * Validation: Only adds task if input is not empty after trimming
   * Side effects: Clears input field on success
   */
  const handleAddTodo = () => {
    if (newTodo.trim()) {
      try {
        addTask(newTodo.trim());
        setNewTodo(""); // Clear input after successful addition
      } catch (error) {
        console.log("Error adding a todo", error);
        Alert.alert("Error", "Failed to add todo");
      }
    }
  };

  return (
    <View style={homeStyles.inputSection}>
      <View style={homeStyles.inputWrapper}>
        <TextInput
          style={homeStyles.input}
          placeholder="What needs to be done?"
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
          placeholderTextColor={colors.textMuted}
        />
        <TouchableOpacity
          onPress={handleAddTodo}
          activeOpacity={0.8}
          disabled={!newTodo.trim()}
        >
          <LinearGradient
            colors={
              newTodo.trim() ? colors.gradients.primary : colors.gradients.muted
            }
            style={[
              homeStyles.addButton,
              !newTodo.trim() && homeStyles.addButtonDisabled,
            ]}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoInput;
