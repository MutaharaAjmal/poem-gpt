import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type LangKey = "en" | "ur";

export const LANGUAGES: {
  key: LangKey;
  label: string;
  ttsCode: string;
  pitch: number;
  rate: number;
  isRtl: boolean;
}[] = [
  {
    key: "en",
    label: "EN",
    ttsCode: "en-US",
    pitch: 0.94,
    rate: 0.84,
    isRtl: false,
  },
  {
    key: "ur",
    label: "اردو",
    ttsCode: "ur-PK",
    pitch: 1.0,
    rate: 0.92,
    isRtl: true,
  },
];

interface StoryHeaderProps {
  topInset: number;
  onHomePress: () => void;
  isVoicePlaying: boolean;
  onToggleVoice: () => void;
  musicVolumeLevel: number;
  onCycleVolume: () => void;
  lang: LangKey;
  onLanguageSwitch: (newLang: LangKey) => void;
  // Naye props jo aap use kar rahe hain:
  showLangMenu: boolean;
  onToggleLangMenu: () => void;
}

export const StoryHeader = ({
  topInset,
  onHomePress,
  isVoicePlaying,
  onToggleVoice,
  musicVolumeLevel,
  onCycleVolume,
  lang,
  onLanguageSwitch,
}: StoryHeaderProps) => {
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <View style={[styles.header, { top: topInset + 12 }]}>
      {/* Home Button */}
      <TouchableOpacity onPress={onHomePress} style={styles.navBtn}>
        <Ionicons name="home-outline" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* Center: Voice + Volume */}
      <View style={styles.centerControlPanel}>
        <TouchableOpacity style={styles.voicePlayBtn} onPress={onToggleVoice}>
          <Ionicons
            name={isVoicePlaying ? "pause" : "play"}
            size={18}
            color="#fff"
          />
        </TouchableOpacity>

        <View style={styles.innerDivider} />

        <TouchableOpacity
          style={styles.sliderContainer}
          onPress={onCycleVolume}
        >
          <Ionicons
            name={musicVolumeLevel === 0 ? "volume-mute" : "musical-notes"}
            size={16}
            color={musicVolumeLevel === 0 ? "#EF4444" : "#8B5CF6"}
          />
          <View style={styles.barTrack}>
            {[1, 2, 3].map((level) => (
              <View
                key={level}
                style={[
                  styles.barSegment,
                  musicVolumeLevel >= level
                    ? styles.segmentActive
                    : styles.segmentInactive,
                ]}
              />
            ))}
          </View>
        </TouchableOpacity>
      </View>

      {/* Language Dropdown */}
      <View style={styles.langWrapper}>
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setShowLangMenu((v) => !v)}
        >
          <Text style={styles.langText}>
            {LANGUAGES.find((l) => l.key === lang)?.label ?? "EN"}
          </Text>
          <Ionicons
            name={showLangMenu ? "chevron-up" : "chevron-down"}
            size={12}
            color="#fff"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>

        {showLangMenu && (
          <View style={styles.langDropdown}>
            {LANGUAGES.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.langOption,
                  lang === item.key && styles.langOptionActive,
                ]}
                onPress={() => {
                  onLanguageSwitch(item.key);
                  setShowLangMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.langOptionText,
                    lang === item.key && styles.langOptionTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 300,
    position: "absolute",
    left: 0,
    right: 0,
  },
  navBtn: {
    backgroundColor: "#8B5CF6",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  centerControlPanel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  voicePlayBtn: {
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  innerDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 12,
  },
  sliderContainer: { flexDirection: "row", alignItems: "center" },
  barTrack: {
    flexDirection: "row",
    marginLeft: 8,
    alignItems: "center",
    gap: 4,
  },
  barSegment: { width: 20, height: 6, borderRadius: 3 },
  segmentActive: { backgroundColor: "#8B5CF6" },
  segmentInactive: { backgroundColor: "rgba(255,255,255,0.25)" },

  langWrapper: {
    position: "relative",
    zIndex: 400,
    marginRight: 30,
    marginLeft: 40,
  },
  langBtn: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 24,
    paddingVertical: 9,
    borderRadius: 20,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 72,
    justifyContent: "center",
  },
  langText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  langDropdown: {
    position: "absolute",
    top: 46,
    right: 0,
    backgroundColor: "rgba(15, 8, 40, 0.97)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.45)",
    overflow: "hidden",
    minWidth: 110,
    elevation: 20,
  },
  langOption: {
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  langOptionActive: {
    backgroundColor: "rgba(139, 92, 246, 0.35)",
  },
  langOptionText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  langOptionTextActive: {
    color: "#fff",
  },
});
