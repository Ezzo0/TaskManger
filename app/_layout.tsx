/**
 * Root Layout Component
 *
 * The top-level layout for the entire application.
 * Sets up the provider hierarchy and navigation structure.
 *
 * Provider Hierarchy (outer to inner):
 * 1. ThemeProvider - Provides theme colors and dark mode toggle
 * 2. TaskProvider - Provides task state and CRUD operations
 * 3. Stack Navigator - Handles screen navigation
 *
 * Note: ThemeProvider wraps TaskProvider because theme is a more fundamental
 * concern that should be available to all components, including task-related ones.
 */

import { TaskProvider } from "@/hooks/useTasks";
import { ThemeProvider } from "@/hooks/useTheme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TaskProvider>
        {/* Stack Navigator with hidden header (using custom headers in screens) */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </TaskProvider>
    </ThemeProvider>
  );
}
