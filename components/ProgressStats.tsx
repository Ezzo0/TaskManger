/**
 * ProgressStats Component
 *
 * Displays task statistics in the settings screen.
 * Shows three key metrics in visually distinct cards.
 *
 * Metrics:
 * - Total Tasks: All tasks (completed + active)
 * - Completed Tasks: Tasks marked as done
 * - Active Tasks: Tasks still pending (calculated as total - completed)
 *
 * Design:
 * - Each metric has a colored left border for visual distinction
 * - Icons with gradient backgrounds matching the metric type
 * - Large numbers for easy readability
 */

import { createSettingsStyles } from "@/assets/styles/settings.styles";
import useTasks from "@/hooks/useTasks";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

const ProgressStats = () => {
  const { colors } = useTheme();
  const settingsStyles = createSettingsStyles(colors);

  const { tasks } = useTasks();

  // Calculate task statistics
  const totalTasks = tasks ? tasks.length : 0;
  const completedTasks = tasks
    ? tasks.filter((task) => task.completed).length
    : 0;
  const activeTasks = totalTasks - completedTasks;

  return (
    <LinearGradient
      colors={colors.gradients.surface}
      style={settingsStyles.section}
    >
      <Text style={settingsStyles.sectionTitle}>Progress Stats</Text>

      <View style={settingsStyles.statsContainer}>
        {/* TOTAL TASKS */}
        <LinearGradient
          colors={colors.gradients.background}
          style={[settingsStyles.statCard, { borderLeftColor: colors.primary }]}
        >
          <View style={settingsStyles.statIconContainer}>
            <LinearGradient
              colors={colors.gradients.primary}
              style={settingsStyles.statIcon}
            >
              <Ionicons name="list" size={20} color="#fff" />
            </LinearGradient>
          </View>

          <View>
            <Text style={settingsStyles.statNumber}>{totalTasks}</Text>
            <Text style={settingsStyles.statLabel}>Total Tasks</Text>
          </View>
        </LinearGradient>

        {/* COMPLETED TASKS */}
        <LinearGradient
          colors={colors.gradients.background}
          style={[settingsStyles.statCard, { borderLeftColor: colors.success }]}
        >
          <View style={settingsStyles.statIconContainer}>
            <LinearGradient
              colors={colors.gradients.success}
              style={settingsStyles.statIcon}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </LinearGradient>
          </View>

          <View>
            <Text style={settingsStyles.statNumber}>{completedTasks}</Text>
            <Text style={settingsStyles.statLabel}>Completed</Text>
          </View>
        </LinearGradient>

        {/* ACTIVE TASKS */}

        <LinearGradient
          colors={colors.gradients.background}
          style={[settingsStyles.statCard, { borderLeftColor: colors.warning }]}
        >
          <View style={settingsStyles.statIconContainer}>
            <LinearGradient
              colors={colors.gradients.warning}
              style={settingsStyles.statIcon}
            >
              <Ionicons name="time" size={20} color="#fff" />
            </LinearGradient>
          </View>

          <View>
            <Text style={settingsStyles.statNumber}>{activeTasks}</Text>
            <Text style={settingsStyles.statLabel}>Active</Text>
          </View>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

export default ProgressStats;
