import { useDebugDate } from "@/context/debug-date-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActivityGrid from "@/components/activity-grid";
import HabitsCard, { type Habit } from "@/components/habits-card";
import StatCard from "@/components/stat-card";
import WeatherCard from "@/components/weather-card";

const STREAK_KEY = "daily_streak";
const HISTORY_KEY = "completion_history";

type StreakData = {
  count: number;
  lastDate: string | null;
};

function dateToString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function HomePage() {
  const { debugModeEnabled, today, shiftDay } = useDebugDate();

  const [dailyHabits, setDailyHabits] = useState<Habit[]>([]);
  const [weeklyHabits, setWeeklyHabits] = useState<Habit[]>([]);
  const [streak, setStreak] = useState(0);
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());

  const todayStr = dateToString(today);
  const yesterdayStr = (() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return dateToString(d);
  })();

  // Load streak and completion history on mount / when debug date changes
  useEffect(() => {
    AsyncStorage.getItem(STREAK_KEY).then((raw) => {
      if (!raw) return;
      const data: StreakData = JSON.parse(raw);
      if (
        data.lastDate !== todayStr &&
        data.lastDate !== yesterdayStr
      ) {
        setStreak(0);
        AsyncStorage.setItem(
          STREAK_KEY,
          JSON.stringify({ count: 0, lastDate: data.lastDate }),
        );
      } else {
        setStreak(data.count);
      }
    });

    AsyncStorage.getItem(HISTORY_KEY).then((raw) => {
      if (!raw) return;
      const dates: string[] = JSON.parse(raw);
      setCompletedDates(new Set(dates));
    });
  }, [todayStr, yesterdayStr]);

  const allDailyDone =
    dailyHabits.length > 0 && dailyHabits.every((h) => h.completed);

  // When all daily habits are done: update streak + record date in history
  useEffect(() => {
    if (!allDailyDone) return;

    AsyncStorage.getItem(STREAK_KEY).then(async (raw) => {
      const data: StreakData = raw
        ? JSON.parse(raw)
        : { count: 0, lastDate: null };
      if (data.lastDate === todayStr) return;
      const newCount = data.lastDate === yesterdayStr ? data.count + 1 : 1;
      await AsyncStorage.setItem(
        STREAK_KEY,
        JSON.stringify({ count: newCount, lastDate: todayStr }),
      );
      setStreak(newCount);
    });

    AsyncStorage.getItem(HISTORY_KEY).then(async (raw) => {
      const dates: string[] = raw ? JSON.parse(raw) : [];
      if (dates.includes(todayStr)) return;
      const updated = [...dates, todayStr];
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setCompletedDates(new Set(updated));
    });
  }, [allDailyDone, todayStr, yesterdayStr]);

  //Camera and sharing
  async function handleShareProgress() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera access is required to share your progress.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"] as ImagePicker.MediaType[],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      router.push({
        pathname: "/create-post" as any,
        params: { imageUri: result.assets[0].uri, streak: streak.toString() },
      });
    }
  }

  function addDailyHabit(title: string) {
    setDailyHabits((prev) => [
      ...prev,
      { id: Date.now().toString(), title, completed: false },
    ]);
  }
  function removeDailyHabit(id: string) {
    setDailyHabits((prev) => prev.filter((h) => h.id !== id));
  }
  function toggleDailyHabit(id: string) {
    setDailyHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    );
  }

  function addWeeklyHabit(title: string) {
    setWeeklyHabits((prev) => [
      ...prev,
      { id: Date.now().toString(), title, completed: false },
    ]);
  }
  function removeWeeklyHabit(id: string) {
    setWeeklyHabits((prev) => prev.filter((h) => h.id !== id));
  }
  function toggleWeeklyHabit(id: string) {
    setWeeklyHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)),
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>TaskMaxxing</Text>
          {debugModeEnabled && (
            <View style={styles.debugRow}>
              <TouchableOpacity style={styles.debugBtn} onPress={() => shiftDay(-1)}>
                <Text style={styles.debugBtnText}>‹ Prev Day</Text>
              </TouchableOpacity>
              <Text style={styles.debugDate}>{todayStr}</Text>
              <TouchableOpacity style={styles.debugBtn} onPress={() => shiftDay(1)}>
                <Text style={styles.debugBtnText}>Next Day ›</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Testing Firebase Remove after */}

        <HabitsCard
          title="DAILY HABITS"
          habits={dailyHabits}
          completedMessage="Daily habits complete 🎉"
          streak={streak}
          onAdd={addDailyHabit}
          onRemove={removeDailyHabit}
          onToggle={toggleDailyHabit}
          onShareProgress={handleShareProgress}
        />
        <HabitsCard
          title="WEEKLY HABITS"
          habits={weeklyHabits}
          completedMessage="Weekly habits complete 🎉"
          onAdd={addWeeklyHabit}
          onRemove={removeWeeklyHabit}
          onToggle={toggleWeeklyHabit}
        />
        <View style={styles.statRow}>
          <StatCard
            emoji="🔥"
            label={streak > 0 ? `${streak} DAYS` : "NO STREAK"}
          />
          <WeatherCard />
        </View>
        <View style={styles.gridCard}>
          <ActivityGrid completedDates={completedDates} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#9EDCC8",
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#1a1a1a",
  },
  debugRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  debugBtn: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  debugBtnText: {
    fontSize: 13,
    color: "#ccc",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  debugDate: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#4ade80",
    letterSpacing: 1,
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  statRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 14,
  },
  gridCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});
