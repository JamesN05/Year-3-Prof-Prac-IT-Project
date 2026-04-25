import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type Habit = {
  id: string;
  title: string;
};

type Props = {
  title: string;
  habits: Habit[];
  onAdd: (title: string) => void;
  onRemove: (id: string) => void;
};

export default function HabitsCard({ title, habits, onAdd, onRemove }: Props) {
  const [inputText, setInputText] = useState('');

  function handleAdd() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInputText('');
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {habits.map((habit) => (
        <View key={habit.id} style={styles.habitRow}>
          <Text style={styles.habitText}>{'> '}{habit.title}</Text>
          <TouchableOpacity onPress={() => onRemove(habit.id)} hitSlop={8}>
            <Text style={styles.removeBtn}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add habit..."
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  habitText: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  removeBtn: {
    fontSize: 20,
    color: '#999',
    paddingHorizontal: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    paddingVertical: 4,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9EDCC8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addBtnText: {
    fontSize: 20,
    color: '#fff',
    lineHeight: 26,
  },
});
