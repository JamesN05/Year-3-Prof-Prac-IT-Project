import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CALENDAR_WIDTH = SCREEN_WIDTH - 32;

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TODAY = new Date();
const TOTAL_MONTHS = 24;
const CENTER_INDEX = 12;

interface MonthItem {
  year: number;
  month: number;
}

function buildMonths(): MonthItem[] {

  const months: MonthItem[] = [];
  for (let i = -CENTER_INDEX; i < TOTAL_MONTHS - CENTER_INDEX; i++) {
    let m = TODAY.getMonth() + i;
    let y = TODAY.getFullYear();
    while (m < 0) { m += 12; y--; }
    while (m > 11) { m -= 12; y++; }
    months.push({ year: y, month: m });
  }

  return months;
}

function buildGrid(year: number, month: number): (number | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  
  return cells;
}

const MONTHS = buildMonths();

function toKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatKey(key: string): string {
  const [y, m, d] = key.split("-");
  return `${MONTH_NAMES[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

interface MonthCalendarProps extends MonthItem {
  notes: Record<string, string>;
  onDayPress: (key: string) => void;
}

function MonthCalendar({ year, month, notes, onDayPress }: MonthCalendarProps) {

  const grid = buildGrid(year, month);
  const isCurrentMonth =
    year === TODAY.getFullYear() && month === TODAY.getMonth();

  return (
    <View style={styles.monthCard}>
      <Text style={styles.monthTitle}>
        {MONTH_NAMES[month]} {year}
      </Text>

      <View style={styles.dayLabelRow}>
        {DAY_LABELS.map((d) => (
          <Text key={d} style={styles.dayLabel}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((day, idx) => {
          const isToday =
            isCurrentMonth && day === TODAY.getDate();
          const key = day !== null ? toKey(year, month, day) : null;
          const hasNote = key !== null && !!notes[key];

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.cell,
                isToday && styles.todayCell,
                day === null && styles.emptyCell,
              ]}
              onPress={() => key && onDayPress(key)}
              disabled={day === null}
              activeOpacity={0.7}
            >
              {day !== null && (
                <>
                  <Text style={[styles.dayText, isToday && styles.todayText]}>
                    {day}
                  </Text>
                  {hasNote && (
                    <View style={[styles.noteDot, isToday && styles.noteDotToday]} />
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}

      </View>
    </View>
  );


}

export default function CalendarPage() {
  const flatListRef = useRef<FlatList>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  const openModal = (key: string) => {
    setSelectedKey(key);
    setDraftText(notes[key] || "");
    setModalVisible(true);
  };

  const saveNote = () => {
    if (selectedKey) {
      if (draftText.trim()) {
        setNotes((prev) => ({ ...prev, [selectedKey]: draftText.trim() }));
      } else {
        setNotes((prev) => {
          const updated = { ...prev };
          delete updated[selectedKey];
          return updated;
        });
      }
    }
    setModalVisible(false);
  };

  const deleteNote = () => {
    if (selectedKey) {
      setNotes((prev) => {
        const updated = { ...prev };
        delete updated[selectedKey];
        return updated;
      });
    }
    setModalVisible(false);
  };

  const sortedNotes = Object.entries(notes).sort(([a], [b]) => a.localeCompare(b));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Track your habits over time</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={MONTHS}
          keyExtractor={(item) => `${item.year}-${item.month}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={CENTER_INDEX}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <MonthCalendar
              year={item.year}
              month={item.month}
              notes={notes}
              onDayPress={openModal}
            />
          )}
        />

        <View style={styles.importantSection}>
          <Text style={styles.sectionTitle}>Important Dates</Text>
          {sortedNotes.length === 0 ? (
            <Text style={styles.emptyHint}>Tap on a date to get started!</Text>
          ) : (
            sortedNotes.map(([key, note]) => (
              <TouchableOpacity
                key={key}
                style={styles.noteRow}
                onPress={() => openModal(key)}
                activeOpacity={0.7}
              >
                <View style={styles.noteRowLeft}>
                  <Text style={styles.noteDate}>{formatKey(key)}</Text>
                  <Text style={styles.noteBody} numberOfLines={2}>{note}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>
              {selectedKey ? formatKey(selectedKey) : ""}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Add a note..."
              placeholderTextColor="#aaa"
              value={draftText}
              onChangeText={setDraftText}
              multiline
              autoFocus
            />
            <View style={styles.modalButtons}>
              {selectedKey && notes[selectedKey] && (
                <TouchableOpacity style={styles.deleteBtn} onPress={deleteNote}>
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#9EDCC8",
  },

  scroll: {
    paddingTop: 20,
    paddingBottom: 32,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
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

  flatListContent: {},

  monthCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    width: CALENDAR_WIDTH,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 16,
  },

  dayLabelRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
    
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
  },
   
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyCell: {
    opacity: 0,
  },

  todayCell: {
    backgroundColor: "#2ECC8C",
    borderRadius: 100,
  },

  dayText: {
    fontSize: 13,
    color: "#333",
  },

  todayText: {
    color: "#fff",
    fontWeight: "bold",
  },

  noteDot: {
    position: "absolute",
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2ECC8C",
  },

  noteDotToday: {
    backgroundColor: "#fff",
  },

  importantSection: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
  },

  emptyHint: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    paddingVertical: 12,
  },

  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },

  noteRowLeft: {
    flex: 1,
  },

  noteDate: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },

  noteBody: {
    fontSize: 13,
    color: "#666",
  },

  chevron: {
    fontSize: 22,
    color: "#ccc",
    marginLeft: 8,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: SCREEN_WIDTH - 48,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#1a1a1a",
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },

  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
    marginRight: "auto",
  },

  deleteBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ef4444",
  },

  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },

  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },

  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#2ECC8C",
  },

  saveBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
