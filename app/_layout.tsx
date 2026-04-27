import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { router, Slot, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AuthGate() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuth = (segments[0] as string) === "(auth)";
    if (!user && !inAuth) {
      router.replace("/(auth)/login" as any);
    } else if (user && inAuth) {
      router.replace("/(tabs)" as any);
    }
  }, [user, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
