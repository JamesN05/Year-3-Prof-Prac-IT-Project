import { FRIENDS } from "@/components/friends";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SocialPost from "../social-post";

type PostData = {
  id: number;
  friendIndex: number;
  postImage?: number;
  message: string;
  postImageUri?: string;
  streak: number;
};

const USER_POSTS_KEY = "user_posts";

const POST_IMAGES = [
  require("@/assets/images/SocialPost1.png"),
  require("@/assets/images/SocialPost2.png"),
  require("@/assets/images/SocialPost3.png"),
  require("@/assets/images/SocialPost4.png"),
  require("@/assets/images/SocialPost5.png"),
];

const GREGORY_AVATAR = require("@/assets/images/Gregory.png");

const INITIAL_POSTS: PostData[] = [
  {
    id: 0,
    friendIndex: 4,
    postImage: POST_IMAGES[4],
    streak: FRIENDS[4].streak,
    message: `${FRIENDS[4].name} has completed all of their daily tasks 🎉`,
  },
];

export default function SocialPage() {
  const [posts, setPosts] = useState<PostData[]>(INITIAL_POSTS);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(USER_POSTS_KEY).then((raw) => {
        console.log("RAW FROM STORAGE:", raw);
        if (!raw) return;
        const userPosts: PostData[] = JSON.parse(raw);
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = userPosts.filter((p) => !existingIds.has(p.id));
          return [...newOnes, ...prev];
        });
      });
    }, []),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const shouldPost = Math.random() < 0.05;
      if (!shouldPost) return;

      const randomFriendIndex = Math.floor(Math.random() * FRIENDS.length);
      const randomImageIndex = Math.floor(Math.random() * POST_IMAGES.length);
      const newPost: PostData = {
        id: Date.now(),
        friendIndex: randomFriendIndex,
        postImage: POST_IMAGES[randomImageIndex],
        streak: FRIENDS[randomFriendIndex].streak,
        message:
          Math.random() < 0.25
            ? `${FRIENDS[randomFriendIndex].name} has completed all of their weekly tasks 🎉`
            : `${FRIENDS[randomFriendIndex].name} has completed all of their daily tasks 🎉`,
      };
      setPosts((p) => [newPost, ...p]);
      return randomFriendIndex;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
          {posts.map((post) => (
            <SocialPost
              key={post.id}
              name={
                post.friendIndex === -1
                  ? "User"
                  : FRIENDS[post.friendIndex].name
              }
              streak={post.streak}
              avatar={
                post.friendIndex === -1
                  ? GREGORY_AVATAR
                  : FRIENDS[post.friendIndex].avatar
              }
              postImage={post.postImage}
              postImageUri={post.postImageUri}
              message={post.message}
            />
          ))}
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
});
