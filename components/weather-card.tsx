import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CITY_KEY = "weather_city";
const DEFAULT_CITY = "Galway";
const API_KEY = process.env.EXPO_PUBLIC_OPENWEB_API_KEY;

const WEATHER_EMOJI: Record<string, string> = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
  Smoke: "🌫️",
  Dust: "🌫️",
  Tornado: "🌪️",
};

type WeatherData = {
  emoji: string;
  condition: string;
  temp: number;
};

export default function WeatherCard() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");

  // Load saved city on mount
  useEffect(() => {
    AsyncStorage.getItem(CITY_KEY).then((saved) => {
      setCity(saved ?? DEFAULT_CITY);
    });
  }, []);

  // Fetch weather whenever city changes
  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        const main: string = data.weather[0].main;
        setWeather({
          emoji: WEATHER_EMOJI[main] ?? "🌡️",
          condition: main.toUpperCase(),
          temp: Math.round(data.main.temp),
        });
      } catch {
        setError(true);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [city]);

  function openModal() {
    setInputText(city);
    setModalVisible(true);
  }

  async function saveCity() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    await AsyncStorage.setItem(CITY_KEY, trimmed);
    setCity(trimmed);
    setModalVisible(false);
  }

  const emoji = loading ? "⏳" : error ? "❓" : weather!.emoji;
  const condition = loading ? "LOADING" : error ? "NOT FOUND" : weather!.condition;
  const tempDisplay = !loading && !error ? `${weather!.temp}°` : null;

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onLongPress={openModal}
        delayLongPress={400}
        activeOpacity={0.85}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        {tempDisplay ? (
          <Text style={styles.temp}>{tempDisplay}</Text>
        ) : null}
        <Text style={styles.condition}>{condition}</Text>
        <Text style={styles.city}>{city}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Change Location</Text>
            <TextInput
              style={styles.dialogInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Enter city name..."
              placeholderTextColor="#aaa"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={saveCity}
            />
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveCity}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 2,
  },
  temp: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: 38,
  },
  condition: {
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "#333",
  },
  city: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#222",
    marginBottom: 16,
  },
  dialogButtons: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    color: "#666",
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#9EDCC8",
    alignItems: "center",
  },
  saveText: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
});
