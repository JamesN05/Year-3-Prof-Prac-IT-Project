import { db } from "@/firebase";
import { useDebugDate } from "@/context/debug-date-context";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsPage() {
  const router = useRouter();
  const auth = getAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [tempUnit, setTempUnit] = useState("C");
  const { debugModeEnabled, setDebugModeEnabled } = useDebugDate();

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (userId) {
      loadSettings();
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    saveSettings();
  }, [darkMode, dailyReminder, streakAlerts, weeklySummary, tempUnit]);

  const loadSettings = async () => {
    if (!userId) return;
    try {
      const ref = doc(db, "settings", userId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const s = snap.data();
        setDarkMode(s.darkMode ?? false);
        setDailyReminder(s.dailyReminder ?? true);
        setStreakAlerts(s.streakAlerts ?? true);
        setWeeklySummary(s.weeklySummary ?? false);
        setTempUnit(s.tempUnit ?? "C");
      }
    } catch (e) {
      console.log("Failed to load settings:", e);
    }
  };

  const saveSettings = async () => {
    if (!userId) return;
    try {
      const ref = doc(db, "settings", userId);
      await setDoc(ref, {
        darkMode,
        dailyReminder,
        streakAlerts,
        weeklySummary,
        tempUnit,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.log("Failed to save settings:", e);
    }
  };

  const syncNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (dailyReminder) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Daily Reminder",
            body: "Don't forget to complete your tasks today!",
          },
          trigger: { hour: 9, minute: 0, repeats: true } as any,
        });
      }

      if (streakAlerts) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Streak Alert",
            body: "Keep your streak alive!",
          },
          trigger: { seconds: 3600, repeats: true } as any,
        });
      }
    } catch (e) {
      console.log("Failed to sync notifications:", e);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/(auth)/login" as any);
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: darkMode ? "#111" : "#9EDCC8",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 20,
          color: darkMode ? "white" : "black",
        }}
      >
        Settings
      </Text>

      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontWeight: "700" }}>Appearance</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontWeight: "700" }}>Notifications</Text>
        <Row
          label="Daily Reminder"
          value={dailyReminder}
          setValue={setDailyReminder}
        />
        <Row
          label="Streak Alerts"
          value={streakAlerts}
          setValue={setStreakAlerts}
        />
        <Row
          label="Weekly Summary"
          value={weeklySummary}
          setValue={setWeeklySummary}
        />
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontWeight: "700" }}>Weather</Text>
        <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
          <TouchableOpacity onPress={() => setTempUnit("C")}>
            <Text>°C</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTempUnit("F")}>
            <Text>°F</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/(auth)/login" as any)}>
          <Text>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://example.com/privacy")}
        >
          <Text style={{ marginTop: 12 }}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:support@taskmaxxing.com")}
        >
          <Text style={{ marginTop: 12 }}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 16,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontWeight: "700" }}>Developer</Text>
        <Row
          label="Debug Mode (date override)"
          value={debugModeEnabled}
          setValue={setDebugModeEnabled}
        />
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        style={{ backgroundColor: "#ffdddd", padding: 16, borderRadius: 16 }}
      >
        <Text style={{ textAlign: "center", fontWeight: "700", color: "red" }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Row({
  label,
  value,
  setValue,
}: {
  label: string;
  value: boolean;
  setValue: (v: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
      }}
    >
      <Text>{label}</Text>
      <Switch value={value} onValueChange={setValue} />
    </View>
  );
}
