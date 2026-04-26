import { FRIENDS } from "@/components/friends";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SocialPost from "../social-post";

export default function SocialPage() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Social</Text>
          <Text style={styles.subtitle}>
            Let everyone know about your achievements!
          </Text>
        </View>
        <View>
          <SocialPost
            name={FRIENDS[4].name}
            streak={FRIENDS[4].streak}
            avatar={FRIENDS[4].avatar}
            postImage={require("@/assets/images/SocialPost4.png")}
            message="Has completed all of their daily tasks 🎉"
          />
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
    paddingTop: 20,
    paddingBottom: 16,
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
  empty: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: "#555",
  },
});
