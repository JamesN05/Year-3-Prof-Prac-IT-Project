import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  value?: string;
  type?: "toggle" | "nav" | "info" | "danger";
  toggled?: boolean;
  onPress?: () => void;
  isLast?: boolean;
};

export default function SettingsRow({
  label,
  value,
  type = "nav",
  toggled = false,
  onPress,
  isLast = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={type === "info" ? 1 : 0.6}
    >
      <Text style={[styles.label, type === "danger" && styles.labelDanger]}>
        {label}
      </Text>

      {type === "toggle" && (
        <View style={[styles.toggle, toggled && styles.toggleOn]}>
          <View style={[styles.thumb, toggled && styles.thumbOn]} />
        </View>
      )}

      {type === "nav" && (
        <View style={styles.navRight}>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          <Text style={styles.chevron}>›</Text>
        </View>
      )}

      {type === "info" && value ? (
        <Text style={styles.value}>{value}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 15,
    color: "#222",
  },
  labelDanger: {
    color: "#e03030",
  },
  value: {
    fontSize: 14,
    color: "#999",
    marginRight: 4,
  },
  navRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevron: {
    fontSize: 20,
    color: "#ccc",
    lineHeight: 22,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ddd",
    justifyContent: "center",
    padding: 2,
  },
  toggleOn: {
    backgroundColor: "#9EDCC8",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: "flex-start",
  },
  thumbOn: {
    alignSelf: "flex-end",
  },
});
