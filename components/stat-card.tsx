import { StyleSheet, Text, View } from 'react-native';

type Props = {
  emoji: string;
  label: string;
};

export default function StatCard({ emoji, label }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#333',
  },
});
