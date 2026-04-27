import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SettingsRow from "@/components/settings-row";

function SectionLabel({ title }: { title: string }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export default function SettingsPage() {
  // Theme
  const [theme, setTheme] = useState<"Light" | "Dark" | "System">("System");

  // Notifications
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // Habit preferences
  const [showStreak, setShowStreak] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Weather
  const [tempUnit, setTempUnit] = useState<"°C" | "°F">("°C");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Settings</Text>
        </View>

        {/* ── Profile ── */}
        <Card>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Your Name</Text>
              <Text style={styles.profileEmail}>you@example.com</Text>
            </View>
          </View>
          <View style={styles.cardDivider} />
          <SettingsRow label="Edit Profile" type="nav" isLast />
        </Card>

        {/* ── Theme ── */}
        <SectionLabel title="APPEARANCE" />
        <Card>
          <View style={styles.segmentedWrapper}>
            <Text style={styles.segmentedLabel}>Theme</Text>
            <View style={styles.segmented}>
              {(["Light", "Dark", "System"] as const).map((option, i, arr) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.segment,
                    theme === option && styles.segmentActive,
                    i === 0 && styles.segmentFirst,
                    i === arr.length - 1 && styles.segmentLast,
                  ]}
                  onPress={() => setTheme(option)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      theme === option && styles.segmentTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* ── Notifications ── */}
        <SectionLabel title="NOTIFICATIONS" />
        <Card>
          <SettingsRow
            label="Daily Reminder"
            type="toggle"
            toggled={dailyReminder}
            onPress={() => setDailyReminder((v) => !v)}
          />
          <SettingsRow
            label="Streak Alerts"
            type="toggle"
            toggled={streakAlerts}
            onPress={() => setStreakAlerts((v) => !v)}
          />
          <SettingsRow
            label="Weekly Summary"
            type="toggle"
            toggled={weeklySummary}
            onPress={() => setWeeklySummary((v) => !v)}
            isLast
          />
        </Card>

        {/* ── Habit Preferences ── */}
        <SectionLabel title="HABIT PREFERENCES" />
        <Card>
          <SettingsRow
            label="Show Streak Counter"
            type="toggle"
            toggled={showStreak}
            onPress={() => setShowStreak((v) => !v)}
          />
          <SettingsRow
            label="Show Activity Heatmap"
            type="toggle"
            toggled={showHeatmap}
            onPress={() => setShowHeatmap((v) => !v)}
          />
          <SettingsRow
            label="Daily Reminder Time"
            type="nav"
            value="08:00 AM"
          />
          <SettingsRow
            label="Weekly Reset Day"
            type="nav"
            value="Monday"
            isLast
          />
        </Card>

        {/* ── Weather ── */}
        <SectionLabel title="WEATHER" />
        <Card>
          <SettingsRow label="Default City" type="nav" value="Galway" />
          <View style={styles.segmentedWrapper}>
            <Text style={styles.segmentedLabel}>Temperature Unit</Text>
            <View style={styles.segmented}>
              {(["°C", "°F"] as const).map((option, i, arr) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.segment,
                    tempUnit === option && styles.segmentActive,
                    i === 0 && styles.segmentFirst,
                    i === arr.length - 1 && styles.segmentLast,
                  ]}
                  onPress={() => setTempUnit(option)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      tempUnit === option && styles.segmentTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card>

        {/* ── App ── */}
        <SectionLabel title="APP" />
        <Card>
          <SettingsRow label="Version" type="info" value="1.0.0" />
          <SettingsRow label="About TaskMaxxing" type="nav" />
          <SettingsRow label="Help & Support" type="nav" />
          <SettingsRow label="Privacy Policy" type="nav" isLast />
        </Card>

        <Card>
          <SettingsRow label="Sign Out" type="danger" isLast />
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>TaskMaxxing v1.0.0</Text>
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
    paddingBottom: 40,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#1a1a1a",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
    letterSpacing: 0.6,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
  },
  // Profile
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e8f8f3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: "#999",
  },
  // Segmented control
  segmentedWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  segmentedLabel: {
    fontSize: 15,
    color: "#222",
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  segmentFirst: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  segmentLast: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  segmentActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  segmentTextActive: {
    color: "#222",
    fontWeight: "600",
  },
  // Footer
  footer: {
    alignItems: "center",
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#888",
  },
});
