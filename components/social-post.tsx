import { useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PostInfo = {
  name: string;
  streak: number;
  avatar: ImageSourcePropType;
  postImage?: ImageSourcePropType;
  postImageUri?: string;
  message: string;
};

export default function SocialPost({
  name,
  streak,
  avatar,
  postImage,
  postImageUri,
  message,
}: PostInfo) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      //console.log("tick", Date.now());
      const shouldLike = Math.random() < 0.1;
      if (!shouldLike) return;
      setLikeCount((prev) => {
        //console.log("incrementing to", prev + 1);
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function handleLike() {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={avatar} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <Image
        source={postImageUri ? { uri: postImageUri } : postImage!}
        style={styles.postImage}
        resizeMode="cover"
      />
      <View style={styles.footer}>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.likeRow}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <Text style={styles.likeHeart}>{liked ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
          <Text style={[styles.likeCount, liked && styles.likeCountActive]}>
            {likeCount}
          </Text>
        </View>
        <Text style={styles.streak}>🔥 {streak}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  postImage: {
    width: "100%",
    height: 200,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  message: {
    fontSize: 13,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  likeHeart: {
    fontSize: 20,
  },
  likeCount: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  likeCountActive: {
    color: "#e0445f",
  },
  streak: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#c96a00",
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
