import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface StorySpeakerProps {
  textToSpeak: string;
}

export const StorySpeaker = ({ textToSpeak }: StorySpeakerProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleSpeech = async () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);

      Speech.speak(textToSpeak, {
        language: "en",
        pitch: 1.0,
        rate: 0.85, // Bachon k liye perfect sweet slow speed
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  return (
    <TouchableOpacity
      style={[styles.speakerButton, isSpeaking && styles.speakingActive]}
      onPress={toggleSpeech}
      activeOpacity={0.8}
    >
      <Ionicons
        name={isSpeaking ? "stop-circle-outline" : "volume-high-outline"}
        size={22}
        color="#fff"
      />
      <Text style={styles.speakerText}>
        {isSpeaking ? "Stop Listening" : "Listen to Story (AI Voice)"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  speakerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Premium Glassmorphic style
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginTop: 20,
    alignSelf: "flex-start",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  speakingActive: {
    backgroundColor: "#1E3A8A", // Apka Custom Theme Accent color apply ho gaya!
    borderColor: "#3B82F6",
  },
  speakerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
});
