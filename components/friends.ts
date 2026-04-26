import { ImageSourcePropType } from "react-native";

export type Friend = {
  id: string;
  name: string;
  streak: number;
  avatar: ImageSourcePropType;
};

export const FRIENDS: Friend[] = [
  {
    id: "friend_1",
    name: "Bobby O'Reilly",
    streak: 3,
    avatar: require("@/assets/images/Bobby.png"),
  },
  {
    id: "friend_2",
    name: "Shane O'Donoghue",
    streak: 1,
    avatar: require("@/assets/images/Shane.png"),
  },
  {
    id: "friend_3",
    name: "Timothy MacDonnagh",
    streak: 5,
    avatar: require("@/assets/images/Timothy.png"),
  },
  {
    id: "friend_4",
    name: "Samuel Lin",
    streak: 8,
    avatar: require("@/assets/images/Samuel.png"),
  },
  {
    id: "friend_5",
    name: "Gregory Jones",
    streak: 2,
    avatar: require("@/assets/images/Gregory.png"),
  },
];
