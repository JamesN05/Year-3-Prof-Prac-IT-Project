import { useRef } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CALENDAR_WIDTH = SCREEN_WIDTH - 32;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TODAY = new Date();
const TOTAL_MONTHS = 24;
const CENTER_INDEX = 12;

interface MonthItem {
  year: number;
  month: number;
}

function buildMonths(): MonthItem[] {

  const months: MonthItem[] = [];
  for (let i = -CENTER_INDEX; i < TOTAL_MONTHS - CENTER_INDEX; i++) {
    let m = TODAY.getMonth() + i;
    let y = TODAY.getFullYear();
    while (m < 0) { m += 12; y--; }
    while (m > 11) { m -= 12; y++; }
    months.push({ year: y, month: m });
  }

  return months;
}

function buildGrid(year: number, month: number): (number | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  
  return cells;
}

const MONTHS = buildMonths();

function MonthCalendar({ year, month }: MonthItem) {

  const grid = buildGrid(year, month);
  const isCurrentMonth =
    year === TODAY.getFullYear() && month === TODAY.getMonth();

  return (
    <View style={styles.monthCard}>
      <Text style={styles.monthTitle}>
        {MONTH_NAMES[month]} {year}
      </Text>

      <View style={styles.dayLabelRow}>
        {DAY_LABELS.map((d) => (
          <Text key={d} style={styles.dayLabel}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((day, idx) => {
          const isToday =
            isCurrentMonth && day === TODAY.getDate();

          return (
            <View
              key={idx}
              style={[
                styles.cell,
                isToday && styles.todayCell,
                day === null && styles.emptyCell,
              ]}
            >
              {day !== null && (
                <Text style={[styles.dayText, isToday && styles.todayText]}>
                  {day}
                </Text>
              )}
            </View>
          );
        })}
        
      </View>
    </View>
  );

  
}

export default function CalendarPage() {
  const flatListRef = useRef<FlatList>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Track your habits over time</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={MONTHS}
          keyExtractor={(item) => `${item.year}-${item.month}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={CENTER_INDEX}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <MonthCalendar year={item.year} month={item.month} />
          )}
        />

        <View style={styles.tile}>
          <Text style={styles.emoji}>!</Text>
          <Text style={styles.tileTitle}>Coming Soon</Text>
          <Text style={styles.tileDescription}>
            Important dates view will be available soon
          </Text>
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

  scroll: {
    paddingTop: 20,
    paddingBottom: 32,
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

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  flatListContent: {},

  monthCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    width: CALENDAR_WIDTH,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 16,
  },

  dayLabelRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
    
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
  },
   
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyCell: {
    opacity: 0,
  },

  todayCell: {
    backgroundColor: "#2ECC8C",
    borderRadius: 100,
  },

  dayText: {
    fontSize: 13,
    color: "#333",
  },

  todayText: {
    color: "#fff",
    fontWeight: "bold",
  },

  tile: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  tileTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },

  tileDescription: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
});
