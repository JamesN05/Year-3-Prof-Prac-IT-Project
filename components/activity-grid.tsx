import { StyleSheet, View } from "react-native";

const WEEKS = 15;
const COLOR_EMPTY = "#ebedf0";
const COLOR_DONE = "#40c463";
const TODAY = new Date().toISOString().split("T")[0];

type Props = {
  completedDates: Set<string>;
};

// Build a Sunday-aligned grid of the last WEEKS weeks, ending with the
// current week. Returns an array of columns (week arrays of date strings).
function buildGrid(): string[][] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun … 6=Sat

  // Rewind to the Sunday that starts the current week, then go back WEEKS-1
  // more weeks to get the grid's first day.
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek - (WEEKS - 1) * 7);

  const grid: string[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(startDate);
      cell.setDate(startDate.getDate() + w * 7 + d);
      week.push(cell.toISOString().split("T")[0]);
    }
    grid.push(week);
  }
  return grid;
}

const GRID = buildGrid();

export default function ActivityGrid({ completedDates }: Props) {
  return (
    <View style={styles.grid}>
      {GRID.map((week, wi) => (
        <View key={wi} style={styles.column}>
          {week.map((dateStr) => {
            const done = completedDates.has(dateStr);
            const isToday = dateStr === TODAY;
            const isFuture = dateStr > TODAY;
            return (
              <View
                key={dateStr}
                style={[
                  styles.cell,
                  { backgroundColor: done ? COLOR_DONE : COLOR_EMPTY },
                  isFuture && styles.cellFuture,
                  isToday && styles.cellToday,
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: 3,
  },
  column: {
    flexDirection: "column",
    gap: 3,
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
  cellFuture: {
    opacity: 0.35,
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: "#555",
  },
});
