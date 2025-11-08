/**
 * Tab Navigation Layout
 *
 * Configures the bottom tab bar navigation for the main app screens.
 * Uses Expo Router's file-based routing with tab navigation.
 *
 * Screens:
 * - index (Tasks) - Main task management screen
 * - settings - App settings and preferences
 *
 * Design Notes:
 * - Tab bar height is 90px to accommodate safe area on iOS devices
 * - Uses theme colors for consistent styling across light/dark modes
 * - Custom headers are implemented in individual screens (headerShown: false)
 */

import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 90, // Increased height for better touch targets and safe area
          paddingBottom: 30, // Extra padding for iOS home indicator
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false, // Using custom headers in each screen
      }}
    >
      {/* Main Tasks Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Settings Screen */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
