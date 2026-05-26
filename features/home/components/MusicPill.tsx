import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MusicPillProps {
  isMuted: boolean;
  onPress: () => void;
}

export const MusicPill = ({ isMuted, onPress }: MusicPillProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.musicPill}
      activeOpacity={0.85}
    >
      {/* Play/Pause circle */}
      <View style={styles.musicPlayBtn}>
        <Ionicons
          name={isMuted ? "pause" : "play"}
          size={15}
          color="#fff"
          style={{ marginLeft: isMuted ? 0 : 2 }}
        />
      </View>

      {/* Text */}
      <View>
        <Text style={styles.musicPillTitle}>Magical Tunes</Text>
        <Text style={styles.musicPillSub}>
          {isMuted ? "Paused" : "Now Playing"}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.musicDivider} />

      {/* Volume icon */}
      <Ionicons
        name={isMuted ? "volume-mute" : "volume-high"}
        size={18}
        color={isMuted ? "#EF4444" : "rgba(255,255,255,0.7)"}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  musicPill: {
    position: "absolute",
    bottom: 6,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(20,10,50,0.80)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.5)",
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 18,
    zIndex: 999,
  },
  musicPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  musicPillTitle: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  musicPillSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 10,
    marginTop: 1,
  },
  musicDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
