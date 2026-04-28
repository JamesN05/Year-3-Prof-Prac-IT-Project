import { useDebugDate } from "@/context/debug-date-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
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
const CELL_SIZE = Math.floor(CALENDAR_WIDTH / 7);
// paddingVertical*2 + title row + day-label row + 6 grid rows (worst case month)
const CALENDAR_CARD_HEIGHT = 40 + 38 + 20 + 6 * CELL_SIZE;

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
  completedDates: Set<string>;
  onDayPress: (key: string) => void;
  referenceDate: Date;
}

function MonthCalendar({ year, month, notes, completedDates, onDayPress, referenceDate }: MonthCalendarProps) {

  const grid = buildGrid(year, month);
  const isCurrentMonth =
    year === referenceDate.getFullYear() && month === referenceDate.getMonth();

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
            isCurrentMonth && day === referenceDate.getDate();
          const key = day !== null ? toKey(year, month, day) : null;
          const hasNote = key !== null && !!notes[key];
          const isCompleted = key !== null && completedDates.has(key);

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.cell,
                isToday && styles.todayCell,
                isCompleted && styles.completedRing,
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

interface MonthlySummaryProps {
  month: MonthItem;
  completedDates: Set<string>;
  notes: Record<string, string>;
  referenceDate: Date;
}

function MonthlySummary({ month, completedDates, notes, referenceDate }: MonthlySummaryProps) {
  const { year, month: m } = month;
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const isCurrentMonth = year === referenceDate.getFullYear() && m === referenceDate.getMonth();
  const isPast = year < referenceDate.getFullYear() || (year === referenceDate.getFullYear() && m < referenceDate.getMonth());
  const elapsedDays = isCurrentMonth ? referenceDate.getDate() : isPast ? daysInMonth : 0;

  const prefix = `${year}-${String(m + 1).padStart(2, "0")}`;
  let completedCount = 0;
  completedDates.forEach((d) => { if (d.startsWith(prefix)) completedCount++; });
  const notesCount = Object.keys(notes).filter((k) => k.startsWith(prefix)).length;
  const rate = elapsedDays > 0 ? Math.round((completedCount / elapsedDays) * 100) : null;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{MONTH_NAMES[m]} {year}</Text>
      <View style={styles.summaryRow}>
        <View style={styles.summaryTile}>
          <Text style={styles.summaryValue}>{completedCount}</Text>
          <Text style={styles.summaryLabel}>Days{"\n"}Completed</Text>
        </View>
        <View style={styles.summaryTile}>
          <Text style={styles.summaryValue}>{rate !== null ? `${rate}%` : "—"}</Text>
          <Text style={styles.summaryLabel}>Completion{"\n"}Rate</Text>
        </View>
        <View style={styles.summaryTile}>
          <Text style={styles.summaryValue}>{notesCount}</Text>
          <Text style={styles.summaryLabel}>Notes{"\n"}Added</Text>
        </View>
      </View>
    </View>
  );
}

export default function CalendarPage() {
  const { today } = useDebugDate();
  const flatListRef = useRef<FlatList>(null);
  const [visibleMonthIdx, setVisibleMonthIdx] = useState(CENTER_INDEX);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setVisibleMonthIdx(viewableItems[0].index);
  }, []);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("completion_history").then((raw) => {
      if (!raw) return;
      setCompletedDates(new Set(JSON.parse(raw) as string[]));
    });
  }, [visibleMonthIdx]);

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
          style={{ height: CALENDAR_CARD_HEIGHT }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig.current}
          renderItem={({ item }) => (
            <MonthCalendar
              year={item.year}
              month={item.month}
              notes={notes}
              completedDates={completedDates}
              onDayPress={openModal}
              referenceDate={today}
            />
          )}
        />

        <MonthlySummary
          month={MONTHS[visibleMonthIdx]}
          completedDates={completedDates}
          notes={notes}
          referenceDate={today}
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
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,

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
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dbfffc",
    borderRadius: 100,
  },

  emptyCell: {
    opacity: 0,
  },

  completedRing: {
    borderWidth: 2,
    borderColor: "#ff9100",
    borderRadius: 100,
  },

  todayCell: {
    backgroundColor: "#2ECC8C",
    borderRadius: 100,
  },

  dayText: {
    fontSize: 13,
    color: "#333",
    alignItems: "center",
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
    marginBottom: 22,
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

  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  summaryTile: {
    alignItems: "center",
    flex: 1,
  },

  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ECC8C",
  },

  summaryLabel: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
    marginTop: 2,
  },
});
