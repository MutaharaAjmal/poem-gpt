import AppHeader from "@/components/ui/AppHeader";
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
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const speeds = ["0.75x", "1.0x", "1.25x", "1.5x"];

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleToggleSpeech = () => {
    if (!text.trim()) {
      Alert.alert("Input Required", "Please paste some text to get started.");
      return;
    }
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      Speech.speak(text, {
        language: lang === "en" ? "en-US" : "ur-PK",
        rate: parseFloat(voiceSpeed.replace("x", "")),
        onDone: () => setIsPlaying(false),
      });
    }
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Voice Studio" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Control Bar */}
        <View style={styles.topRow}>
          <View style={styles.langSelector}>
            <TouchableOpacity
              style={[styles.langBtn, lang === "en" && styles.activeLang]}
              onPress={() => setLang("en")}
            >
              <Text
                style={[styles.langText, lang === "en" && styles.activeText]}
              >
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, lang === "ur" && styles.activeLang]}
              onPress={() => setLang("ur")}
            >
              <Text
                style={[styles.langText, lang === "ur" && styles.activeText]}
              >
                Urdu
              </Text>
            </TouchableOpacity>
          </View>

          {/* Speed Dropdown Trigger */}
          <TouchableOpacity
            style={styles.speedDropdown}
            onPress={() => setShowSpeedMenu(!showSpeedMenu)}
          >
            <Text style={styles.speedText}>{voiceSpeed}</Text>
            <Ionicons name="chevron-down" size={14} color="#A78BFA" />
          </TouchableOpacity>
        </View>

        {showSpeedMenu && (
          <View style={styles.menuOverlay}>
            {speeds.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.menuItem}
                onPress={() => {
                  setVoiceSpeed(s);
                  setShowSpeedMenu(false);
                }}
              >
                <Text style={styles.menuItemText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Minimal Text Input */}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Write your beautiful words here..."
            placeholderTextColor="#4B5563"
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
          />
          <View style={styles.footerRow}>
            <Text style={styles.charCount}>{text.length} / 2000</Text>
          </View>
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.playBtn} onPress={handleToggleSpeech}>
          <LinearGradient
            colors={isPlaying ? ["#EF4444", "#991B1B"] : ["#8B5CF6", "#6D28D9"]}
            style={styles.gradient}
          >
            <Ionicons
              name={isPlaying ? "stop-circle-outline" : "play-circle-outline"}
              size={28}
              color="#fff"
            />
            <Text style={styles.playBtnText}>
              {isPlaying ? "Stop Recitation" : "Start Recitation"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  langSelector: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 4,
  },
  langBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  activeLang: { backgroundColor: "#8B5CF6" },
  langText: { color: "#6B7280", fontSize: 13, fontWeight: "600" },
  activeText: { color: "#fff" },
  speedDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  speedText: { color: "#A78BFA", fontWeight: "bold" },
  menuOverlay: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  menuItem: { padding: 12 },
  menuItemText: { color: "#fff", fontSize: 16 },

  inputContainer: {
    backgroundColor: "#18181B", // Dark grey background
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#27272A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 300,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: "#F4F4F5",
    lineHeight: 24,
  },
  footerRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#27272A",
    alignItems: "flex-end",
  },
  charCount: {
    color: "#71717A",
    fontSize: 12,
  },
  playBtn: { height: 65, borderRadius: 20, overflow: "hidden", marginTop: 10 },
  gradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  playBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
