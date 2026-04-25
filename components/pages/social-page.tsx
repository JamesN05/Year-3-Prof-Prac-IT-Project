import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SocialPage() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Social</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
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
    paddingTop: 20,
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
});
