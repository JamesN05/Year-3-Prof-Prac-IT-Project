import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ActivityGrid from "@/components/activity-grid";
import HabitsCard, { type Habit } from "@/components/habits-card";
import StatCard from "@/components/stat-card";
import WeatherCard from "@/components/weather-card";
//Testing Firebase Remocve after
import FirestoreTerminalTest from "@/components/FirestoreTerminalTest";

const STREAK_KEY = "daily_streak";
const HISTORY_KEY = "completion_history";

type StreakData = {
  count: number;
  lastDate: string | null;
};

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function yesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export default function HomePage() {
  const [dailyHabits, setDailyHabits] = useState<Habit[]>([]);
  const [weeklyHabits, setWeeklyHabits] = useState<Habit[]>([]);
  const [streak, setStreak] = useState(0);
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());

  // Load streak and completion history on mount
  useEffect(() => {
    AsyncStorage.getItem(STREAK_KEY).then((raw) => {
      if (!raw) return;
      const data: StreakData = JSON.parse(raw);
      if (
        data.lastDate !== todayString() &&
        data.lastDate !== yesterdayString()
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
  }, []);

  const allDailyDone =
    dailyHabits.length > 0 && dailyHabits.every((h) => h.completed);

  // When all daily habits are done: update streak + record date in history
  useEffect(() => {
    if (!allDailyDone) return;
    const today = todayString();

    AsyncStorage.getItem(STREAK_KEY).then(async (raw) => {
      const data: StreakData = raw
        ? JSON.parse(raw)
        : { count: 0, lastDate: null };
      if (data.lastDate === today) return;
      const newCount = data.lastDate === yesterdayString() ? data.count + 1 : 1;
      await AsyncStorage.setItem(
        STREAK_KEY,
        JSON.stringify({ count: newCount, lastDate: today }),
      );
      setStreak(newCount);
    });

    AsyncStorage.getItem(HISTORY_KEY).then(async (raw) => {
      const dates: string[] = raw ? JSON.parse(raw) : [];
      if (dates.includes(today)) return;
      const updated = [...dates, today];
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setCompletedDates(new Set(updated));
    });
  }, [allDailyDone]);

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
      router.push({ pathname: "/create-post" as any, params: { imageUri: result.assets[0].uri } });
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
          <Text style={styles.title}>TaskMaxxing™</Text>
        </View>
        
        {/* Testing Firebase Remove after */}
        <FirestoreTerminalTest />

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
