/**
 * Theme Management Hook
 *
 * Provides theme switching functionality with light and dark mode support.
 * Uses React Context API to share theme state across the application.
 *
 * Features:
 * - Light and dark color schemes
 * - Gradient color system for modern UI
 * - System color scheme detection
 * - Manual theme toggle
 */

import { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";

/**
 * ColorScheme interface defining all theme colors and gradients
 *
 * Structure:
 * - Base colors: bg, surface, text, borders
 * - Semantic colors: primary, success, warning, danger
 * - Gradients: Two-color arrays for LinearGradient components
 * - Special backgrounds: Input fields with theme-specific colors
 */
export interface ColorScheme {
  bg: string; // Main background color
  surface: string; // Card/surface background color
  text: string; // Primary text color
  textMuted: string; // Secondary/muted text color
  border: string; // Border and divider color
  primary: string; // Primary brand color (blue)
  success: string; // Success state color (green)
  warning: string; // Warning state color (orange)
  danger: string; // Danger/error state color (red)
  shadow: string; // Shadow color
  gradients: {
    background: [string, string]; // Main background gradient
    surface: [string, string]; // Card surface gradient
    primary: [string, string]; // Primary action gradient
    success: [string, string]; // Success state gradient
    warning: [string, string]; // Warning state gradient
    danger: [string, string]; // Danger state gradient
    muted: [string, string]; // Muted/disabled gradient
    empty: [string, string]; // Empty state gradient
  };
  backgrounds: {
    input: string; // Task input field background
    editInput: string; // Edit mode input background
  };
  statusBarStyle: "light-content" | "dark-content"; // Status bar text color
}

/**
 * Light theme color scheme
 * Based on Tailwind CSS color palette with custom gradients
 */
const lightColors: ColorScheme = {
  bg: "#f8fafc",
  surface: "#ffffff",
  text: "#1e293b",
  textMuted: "#64748b",
  border: "#e2e8f0",
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  shadow: "#000000",
  gradients: {
    background: ["#f8fafc", "#e2e8f0"],
    surface: ["#ffffff", "#f8fafc"],
    primary: ["#3b82f6", "#1d4ed8"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#9ca3af", "#6b7280"],
    empty: ["#f3f4f6", "#e5e7eb"],
  },
  backgrounds: {
    input: "#ffffff",
    editInput: "#ffffff",
  },
  statusBarStyle: "dark-content" as const,
};

/**
 * Dark theme color scheme
 * Based on Tailwind CSS slate palette with enhanced contrast
 */
const darkColors: ColorScheme = {
  bg: "#0f172a",
  surface: "#1e293b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "#334155",
  primary: "#60a5fa",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#f87171",
  shadow: "#000000",
  gradients: {
    background: ["#0f172a", "#1e293b"],
    surface: ["#1e293b", "#334155"],
    primary: ["#3b82f6", "#1d4ed8"],
    success: ["#10b981", "#059669"],
    warning: ["#f59e0b", "#d97706"],
    danger: ["#ef4444", "#dc2626"],
    muted: ["#374151", "#4b5563"],
    empty: ["#374151", "#4b5563"],
  },
  backgrounds: {
    input: "#1e293b",
    editInput: "#0f172a",
  },
  statusBarStyle: "light-content" as const,
};

/**
 * Context type defining theme state and operations
 */
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ColorScheme;
}

const ThemeContext = createContext<undefined | ThemeContextType>(undefined);

/**
 * ThemeProvider Component
 *
 * Wraps the application to provide theme state and color schemes to all child components.
 * Automatically detects system color scheme on initial load.
 *
 * @param {ReactNode} children - Child components that need access to theme context
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Detect the system's color scheme preference (light/dark)
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  /**
   * Toggles between light and dark mode
   */
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Select the appropriate color scheme based on current mode
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme functionality
 *
 * Must be used within a component wrapped by ThemeProvider.
 * Provides access to current theme colors and toggle function.
 *
 * @returns {ThemeContextType} Object containing isDarkMode, toggleDarkMode, and colors
 * @throws {Error} If used outside of ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { colors, isDarkMode, toggleDarkMode } = useTheme();
 *
 *   return (
 *     <View style={{ backgroundColor: colors.bg }}>
 *       <Text style={{ color: colors.text }}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export default useTheme;
