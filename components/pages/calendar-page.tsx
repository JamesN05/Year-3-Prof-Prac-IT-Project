import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarPage() {
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

        <View style={styles.tile}>
          <Text style={styles.emoji}>📅</Text>
          <Text style={styles.tileTitle}>Coming Soon</Text>
          <Text style={styles.tileDescription}>
            Full calendar view will be available soon
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
  tile: {
    marginHorizontal: 16,
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
