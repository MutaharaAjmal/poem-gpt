import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AudioReaderScreen() {
  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState("1.0x");
  const [lang, setLang] = useState<"en" | "ur">("en");

  const speeds = ["0.75x", "1.0x", "1.25x", "1.5x"];

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

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

      const numericSpeed = parseFloat(voiceSpeed.replace("x", ""));
      const voiceLanguage = lang === "en" ? "en-US" : "ur-PK";

      Speech.speak(text, {
        language: voiceLanguage,
        rate: numericSpeed,
        pitch: lang === "ur" ? 1.0 : 0.95,
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

  const handleClear = () => {
    Speech.stop();
    setText("");
    setIsPlaying(false);
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title & Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.mainTitle}>Voice Studio 🎙️</Text>
          <Text style={styles.subTitle}>
            Paste your poetry or essays below and experience cinematic AI voice
            recitation.
          </Text>
        </View>

        {/* ── LANGUAGE SWITCHER PANEL ───────────────────────────── */}
        <View style={styles.languagePanel}>
          <Text style={styles.panelLabel}>Select Voice Engine</Text>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langTab, lang === "en" && styles.activeLangTab]}
              onPress={() => {
                setLang("en");
                if (isPlaying) {
                  Speech.stop();
                  setIsPlaying(false);
                }
              }}
            >
              <Ionicons
                name="text"
                size={16}
                color={lang === "en" ? "#fff" : "#B8B8D2"}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.langTabText,
                  lang === "en" && styles.activeLangTabText,
                ]}
              >
                English AI Voice
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langTab, lang === "ur" && styles.activeLangTab]}
              onPress={() => {
                setLang("ur");
                if (isPlaying) {
                  Speech.stop();
                  setIsPlaying(false);
                }
              }}
            >
              <Ionicons
                name="language-outline"
                size={16}
                color={lang === "ur" ? "#fff" : "#B8B8D2"}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.langTabText,
                  lang === "ur" && styles.activeLangTabText,
                ]}
              >
                Urdu AI Voice
              </Text>
            </TouchableOpacity>
          </View>
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
            placeholder="Paste or type your text here...&#10;&#10;e.g.,&#10;Woh jo hum mein tum mein qarar tha, tumhein yaad ho ke na yaad ho..."
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
            colors={isPlaying ? ["#EF4444", "#DC2626"] : ["#1E3A8A", "#2A1458"]}
            style={styles.gradientBtn}
          >
            <Ionicons
              name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
              size={22}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.btnText}>
              {isPlaying
                ? "Pause Recitation"
                : `Read Aloud in ${lang === "en" ? "English" : "Urdu"}`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 120 },
  headerInfo: { marginBottom: 24 },
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
  languagePanel: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    marginBottom: 20,
  },
  panelLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#A78BFA",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  langRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  langTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  activeLangTab: {
    backgroundColor: "#1E3A8A",
    borderColor: "#3B82F6",
  },
  langTabText: {
    fontSize: 13,
    color: "#B8B8D2",
    fontWeight: "700",
  },
  activeLangTabText: {
    color: "#fff",
  },
  inputCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.15)",
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#A78BFA",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
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
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    lineHeight: 26,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  charCountRow: { alignItems: "flex-end", marginTop: 12 },
  charCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.35)",
    fontWeight: "600",
  },
  controlPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    marginBottom: 30,
  },
  speedRow: { flexDirection: "row", justifyContent: "space-between" },
  speedChip: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  activeSpeedChip: {
    backgroundColor: "#1E3A8A",
    borderColor: "#3B82F6",
  },
  speedText: { fontSize: 13, color: "#B8B8D2", fontWeight: "700" },
  activeSpeedText: { color: "#FFF" },
  buttonContainer: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
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
