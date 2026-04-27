import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const USER_POSTS_KEY = "user_posts";

export default function CreatePostScreen() {
  const [caption, setCaption] = useState(
    "Just completed all my daily habits! 🎉",
  );
  const [posting, setPosting] = useState(false);
  const { imageUri, streak } = useLocalSearchParams<{
    imageUri: string;
    streak: string;
  }>();

  function handleCancel() {
    router.back();
  }

  async function handleShare() {
    setPosting(true);

    const newPost = {
      id: Date.now(),
      friendIndex: -1,
      postImageUri: imageUri,
      streak: Number(streak) || 0,
      message: caption, // use the caption they typed
      createdAt: Date.now(),
    };

    const raw = await AsyncStorage.getItem(USER_POSTS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    await AsyncStorage.setItem(
      USER_POSTS_KEY,
      JSON.stringify([newPost, ...existing]),
    );

    setPosting(false);
    router.push("/(tabs)/social" as any);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} hitSlop={10}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Progress</Text>
          <TouchableOpacity
            onPress={handleShare}
            disabled={posting}
            style={[styles.shareBtn, posting && styles.shareBtnDisabled]}
          >
            <Text style={styles.shareBtnText}>
              {posting ? "Sharing…" : "Share"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Image preview */}
          {imageUri ? (
            <View style={styles.imageCard}>
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={[styles.imageCard, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderText}>📷</Text>
              <Text style={styles.imagePlaceholderSub}>No photo selected</Text>
            </View>
          )}

          {/* Caption */}
          <View style={styles.captionCard}>
            <Text style={styles.captionLabel}>CAPTION</Text>
            <TextInput
              style={styles.captionInput}
              value={caption}
              onChangeText={setCaption}
              multiline
              placeholder="Write something about your progress…"
              placeholderTextColor="#aaa"
              maxLength={280}
            />
            <Text style={styles.charCount}>{caption.length}/280</Text>
          </View>

          {/* Info row */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoEmoji}>🔥</Text>
              <Text style={styles.infoText}>Streak badge will be included</Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoEmoji}>✅</Text>
              <Text style={styles.infoText}>
                Daily habits completion visible to friends
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#9EDCC8",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 15,
    color: "#555",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#1a1a1a",
  },
  shareBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  shareBtnDisabled: {
    opacity: 0.5,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#30a14e",
  },
  scroll: {
    paddingBottom: 40,
  },
  imageCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  imagePlaceholder: {
    aspectRatio: 4 / 3,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  imagePlaceholderSub: {
    fontSize: 14,
    color: "#aaa",
  },
  captionCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  captionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  captionInput: {
    fontSize: 15,
    color: "#222",
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11,
    color: "#bbb",
    textAlign: "right",
    marginTop: 6,
  },
  infoCard: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
});
