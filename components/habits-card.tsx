import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export type Habit = {
  id: string;
  title: string;
  completed: boolean;
};

type Props = {
  title: string;
  habits: Habit[];
  completedMessage: string;
  streak?: number;
  onAdd: (title: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
};

export default function HabitsCard({
  title,
  habits,
  completedMessage,
  streak,
  onAdd,
  onRemove,
  onToggle,
}: Props) {
  const [inputText, setInputText] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const completedCount = habits.filter(h => h.completed).length;
  const total = habits.length;
  const allDone = total > 0 && completedCount === total;

  const counterText =
    total === 0
      ? null
      : allDone
        ? completedMessage
        : `Keep going — ${completedCount}/${total} habits completed`;

  function handleAdd() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInputText('');
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={() => setCollapsed(c => !c)} hitSlop={10}>
          <Text style={styles.collapseBtn}>{collapsed ? '▼' : '▲'}</Text>
        </TouchableOpacity>
      </View>

      {streak !== undefined && streak > 0 && (
        <Text style={styles.streakText}>🔥 {streak} day streak</Text>
      )}

      {counterText !== null && (
        <Text style={[styles.counter, allDone && styles.counterDone]}>{counterText}</Text>
      )}

      {!collapsed && (
        <>
          {habits.map((habit) => (
            <View key={habit.id} style={styles.habitRow}>
              <TouchableOpacity
                style={[styles.checkbox, habit.completed && styles.checkboxDone]}
                onPress={() => onToggle(habit.id)}
                hitSlop={6}
              >
                {habit.completed && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={[styles.habitText, habit.completed && styles.habitTextDone]}>
                {habit.title}
              </Text>
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
        </>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  collapseBtn: {
    fontSize: 14,
    color: '#888',
  },
  streakText: {
    fontSize: 12,
    color: '#e07000',
    fontWeight: '600',
    marginBottom: 4,
  },
  counter: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  counterDone: {
    color: '#30a14e',
    fontWeight: '600',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxDone: {
    backgroundColor: '#9EDCC8',
    borderColor: '#9EDCC8',
  },
  checkmark: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 16,
  },
  habitText: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  habitTextDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  removeBtn: {
    fontSize: 20,
    color: '#ccc',
    paddingHorizontal: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
