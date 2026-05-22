import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech"; // <-- Integrated Real Voice Engine
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function AudioReaderScreen() {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState("1.0x");

  const speeds = ["0.75x", "1.0x", "1.25x", "1.5x"];

  // Cleanup: Agar user back chala jaye ya screen change ho to audio stop ho jaye
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  // Play / Pause Speech Function
  const handleToggleSpeech = () => {
    if (!text.trim()) {
      Alert.alert(
        "Empty Text ✍️",
        "Please paste or type some text first to read aloud!",
      );
      return;
    }

    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);

      // Speed string ("1.0x") ko parsing float context (1.0) mein change karein
      const numericSpeed = parseFloat(voiceSpeed.replace("x", ""));

      Speech.speak(text, {
        language: "en", // Standard English voice (Mix Urdu framework smoothly decode karta hai)
        rate: numericSpeed,
        onDone: () => setIsPlaying(false),
        onError: (error) => {
          console.error("Speech Process Error:", error);
          setIsPlaying(false);
          Alert.alert(
            "Voice Error ❌",
            "Could not process narration on this device.",
          );
        },
      });
    }
  };

  // Clear Text Area
  const handleClear = () => {
    Speech.stop();
    setText("");
    setIsPlaying(false);
  };

  return (
    <LinearGradient
      colors={["#0F1021", "#1A1B3A", "#2A1458"]}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title & Info */}
          <View style={styles.headerInfo}>
            <Text style={styles.mainTitle}>Voice Studio 🎙️</Text>
            <Text style={styles.subTitle}>
              Paste your poetry or essays below and experience cinematic AI
              voice recitation.
            </Text>
          </View>

          {/* Big Input Sheet Card */}
          <View style={styles.inputCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Your Masterpiece Text</Text>
              {text.length > 0 && (
                <TouchableOpacity
                  onPress={handleClear}
                  style={styles.clearBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color="#F87171" />
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            <TextInput
              style={styles.textArea}
              placeholder="Apni shayari ya koi bhi text yahan paste karein...&#10;&#10;e.g.,&#10;Woh jo hum mein tum mein qarar tha..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              textAlignVertical="top"
              value={text}
              onChangeText={setText}
            />

            <View style={styles.charCountRow}>
              <Text style={styles.charCount}>{text.length} Characters</Text>
            </View>
          </View>

          {/* Voice Customization Control Panel */}
          <View style={styles.controlPanel}>
            <Text style={styles.panelLabel}>Speed Control (AI Tempo)</Text>
            <View style={styles.speedRow}>
              {speeds.map((speed) => {
                const isSelected = voiceSpeed === speed;
                return (
                  <TouchableOpacity
                    key={speed}
                    style={[
                      styles.speedChip,
                      isSelected && styles.activeSpeedChip,
                    ]}
                    onPress={() => {
                      setVoiceSpeed(speed);
                      if (isPlaying) {
                        // Dynamic update: audio stop karke fresh runtime state reset karein
                        Speech.stop();
                        setIsPlaying(false);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.speedText,
                        isSelected && styles.activeSpeedText,
                      ]}
                    >
                      {speed}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Big Premium Audio Trigger Button */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleToggleSpeech}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={
                isPlaying ? ["#EF4444", "#DC2626"] : ["#8B5CF6", "#6D28D9"]
              }
              style={styles.gradientBtn}
            >
              <Ionicons
                name={
                  isPlaying ? "pause-circle-outline" : "play-circle-outline"
                }
                size={22}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.btnText}>
                {isPlaying ? "Pause Recitation" : "Read Aloud with AI Voice"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  headerInfo: { marginBottom: 30 },
  mainTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 14,
    color: "#B8B8D2",
    lineHeight: 22,
    fontWeight: "500",
    marginTop: 8,
  },
  inputCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8B5CF6",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  clearText: {
    fontSize: 12,
    color: "#F87171",
    fontWeight: "700",
    marginLeft: 4,
  },
  textArea: {
    height: 220,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    lineHeight: 26,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  charCountRow: { alignItems: "flex-end", marginTop: 12 },
  charCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "600",
  },
  controlPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 30,
  },
  panelLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8B5CF6",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  speedRow: { flexDirection: "row", justifyContent: "space-between" },
  speedChip: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeSpeedChip: { backgroundColor: "#1E3A8A", borderColor: "#3B82F6" },
  speedText: { fontSize: 13, color: "#B8B8D2", fontWeight: "700" },
  activeSpeedText: { color: "#FFF" },
  buttonContainer: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradientBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
