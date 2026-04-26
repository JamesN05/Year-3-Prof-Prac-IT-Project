import { ImageSourcePropType, StyleSheet, Text, View } from "react-native";

type PostInfo = {
  name: string;
  streak: number;
  avatar: ImageSourcePropType;
  postImage: ImageSourcePropType;
  message: string;
};

export default function SocialPost({
  name,
  streak,
  avatar,
  postImage,
  message,
}: PostInfo) {
  return (
    <View style={styles.card}>
      <Text>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
});
