import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const ParagraphCard = ({
  text,
  index,
  isUrdu,
  activeAudioIndex,
  setActiveAudioIndex,
}: any) => {
  const isSpeaking = activeAudioIndex === index;
  // Progress ko 0 se 1 ke darmiyan store karenge
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setActiveAudioIndex(null);
      setProgress(0);
      clearInterval(intervalRef.current);
    } else {
      setActiveAudioIndex(index);
      setProgress(0);

      // 1. Audio Start karein
      Speech.speak(text, {
        language: isUrdu ? "ur-PK" : "en-US",
        onDone: () => {
          setActiveAudioIndex(null);
          setProgress(1); // Finish par pura fill kar do
          clearInterval(intervalRef.current);
        },
      });

      // 2. Bar Progress ko manually sync karein
      // Hum assume karte hain average audio speed 150 words/min hai
      const words = text.split(" ").length;
      const estimatedDuration = (words / 150) * 60 * 1000;
      const step = 0.01;
      const intervalTime = estimatedDuration / 100;

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            clearInterval(intervalRef.current);
            return 1;
          }
          return prev + step;
        });
      }, intervalTime);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleSpeech} style={styles.playBtn}>
        <Ionicons name={isSpeaking ? "pause" : "play"} size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.barContainer}>
        {[...Array(20)].map((_, idx) => {
          // Progress ka logic: Agar current progress bar index se zyada hai to color change
          const barActive = progress >= (idx + 1) / 20;

          return (
            <View
              key={idx}
              style={[styles.barWrapper, { height: Math.random() * 20 + 10 }]}
            >
              <View
                style={[
                  styles.barFill,
                  { backgroundColor: barActive ? "#60A5FA" : "#475569" },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     paddingHorizontal: 15,
//   },
//   playBtn: {
//     width: 45,
//     height: 45,
//     borderRadius: 23,
//     backgroundColor: "#1E3A8A",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   barContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     marginHorizontal: 20,
//   },
//   barWrapper: {
//     width: 5,
//     backgroundColor: "#334155",
//     borderRadius: 2.5,
//     overflow: "hidden",
//     justifyContent: "flex-end",
//   },
//   barFill: { width: "100%", height: "100%" },
// });

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center", // Card ko center mein laane ke liye
    width: "100%",
    paddingVertical: 10,
    // paddingHorizontal: 15,
    // marginTop: 5,
  },
  playBtn: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12, // Play button aur bars ke darmiyan thori si space
  },
  barContainer: {
    flexDirection: "row", // 'flex: 1' hata diya taake yeh center mein rahe aur button ke sath rahe
    alignItems: "center",
    justifyContent: "center",
    gap: 7, // Bars ke darmiyan kam gap
  },
  barWrapper: {
    width: 5,
    backgroundColor: "#334155",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    height: "100%",
  },
});
