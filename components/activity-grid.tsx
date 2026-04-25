import { StyleSheet, View } from 'react-native';

const WEEKS = 15;
const DAYS = 7;

// 0 = no activity, 1–4 = increasing intensity
const INTENSITY_COLORS = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

function mockData(): number[][] {
  return Array.from({ length: WEEKS }, () =>
    Array.from({ length: DAYS }, () => Math.floor(Math.random() * 5))
  );
}

const data = mockData();

export default function ActivityGrid() {
  return (
    <View style={styles.grid}>
      {data.map((week, wi) => (
        <View key={wi} style={styles.column}>
          {week.map((level, di) => (
            <View
              key={di}
              style={[styles.cell, { backgroundColor: INTENSITY_COLORS[level] }]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 3,
  },
  column: {
    flexDirection: 'column',
    gap: 3,
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
});
