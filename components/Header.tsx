import { createHomeStyles } from "@/assets/styles/home.styles";
import useTasks from "@/hooks/useTasks";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

const Header = () => {
  const { colors } = useTheme();

  const homeStyles = createHomeStyles(colors);

  const { tasks } = useTasks();

  const completedCount = tasks
    ? tasks.filter((task) => task.completed).length
    : 0;
  const totalCount = tasks ? tasks.length : 0;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={homeStyles.header}>
      <View style={homeStyles.titleContainer}>
        <LinearGradient
          colors={colors.gradients.primary}
          style={homeStyles.iconContainer}
        >
          <Ionicons name="flash-outline" size={28} color="#fff" />
        </LinearGradient>

        <View style={homeStyles.titleTextContainer}>
          <Text style={homeStyles.title}>Today&apos;s Tasks 👀</Text>
          {tasks && tasks.length > 0 && (
            <Text style={homeStyles.subtitle}>
              {completedCount} of {totalCount} completed
            </Text>
          )}
        </View>
      </View>

      {tasks && tasks.length > 0 && (
        <View style={homeStyles.progressContainer}>
          <View style={homeStyles.progressBarContainer}>
            <View style={homeStyles.progressBar}>
              <LinearGradient
                colors={colors.gradients.success}
                style={[
                  homeStyles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
            <Text style={homeStyles.progressText}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Header;
