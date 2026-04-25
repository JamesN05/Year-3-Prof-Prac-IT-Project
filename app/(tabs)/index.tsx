import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActivityGrid from '@/components/activity-grid';
import HabitsCard, { type Habit } from '@/components/habits-card';
import StatCard from '@/components/stat-card';

export default function HomeScreen() {
  const [dailyHabits, setDailyHabits] = useState<Habit[]>([]);
  const [weeklyHabits, setWeeklyHabits] = useState<Habit[]>([]);

  function addDailyHabit(title: string) {
    setDailyHabits(prev => [...prev, { id: Date.now().toString(), title }]);
  }

  function removeDailyHabit(id: string) {
    setDailyHabits(prev => prev.filter(h => h.id !== id));
  }

  function addWeeklyHabit(title: string) {
    setWeeklyHabits(prev => [...prev, { id: Date.now().toString(), title }]);
  }

  function removeWeeklyHabit(id: string) {
    setWeeklyHabits(prev => prev.filter(h => h.id !== id));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <HabitsCard
          title="DAILY HABITS"
          habits={dailyHabits}
          onAdd={addDailyHabit}
          onRemove={removeDailyHabit}
        />
        <HabitsCard
          title="WEEKLY HABITS"
          habits={weeklyHabits}
          onAdd={addWeeklyHabit}
          onRemove={removeWeeklyHabit}
        />

        <View style={styles.statRow}>
          <StatCard emoji="🔥" label="10 DAYS" />
          <StatCard emoji="☁️" label="CLOUDY" />
        </View>

        <View style={styles.gridCard}>
          <ActivityGrid />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#9EDCC8',
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  statRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 14,
  },
  gridCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});
