import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface AudioPlayerProps {
  audioUrl: string;
  onPlayStart?: () => void; // Naya prop: Background music ko slow/pause karne k liye
  onPlayStop?: () => void; // Naya prop: Background music ko wapas normal karne k liye
}

export const AudioPlayer = ({
  audioUrl,
  onPlayStart,
  onPlayStop,
}: AudioPlayerProps) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function playPauseAudio() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
        if (onPlayStop) onPlayStop(); // Background music normal karo
      } else {
        if (onPlayStart) onPlayStart(); // Background music slow/pause karo
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      // Pehli dafa audio load ho raha hai
      if (onPlayStart) onPlayStart(); // Background music slow/pause karo

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          if (onPlayStop) onPlayStop(); // Background music wapas normal karo
        }
      });
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <TouchableOpacity style={styles.playerButton} onPress={playPauseAudio}>
      <Ionicons
        name={isPlaying ? "pause-circle" : "play-circle"}
        size={24}
        color="#fff"
      />
      <Text style={styles.playerText}>
        {isPlaying ? "Pause Story Narration" : "Listen to Story"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  playerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderWidth: 1,
    borderColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  playerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
});
