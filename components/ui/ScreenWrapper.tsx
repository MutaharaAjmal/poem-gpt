import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
}

// Fixed Render Generation for Stars (Saves Re-renders)
const staticStars = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  top: Math.random() * 800,
  left: Math.random() * 400,
  size: Math.random() * 6 + 6,
}));

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const star1Anim = useRef(new Animated.Value(0.2)).current;
  const star2Anim = useRef(new Animated.Value(0.1)).current;
  const star3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 1. Glow Animation Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // 2. Stars Twinkling Loops
    Animated.loop(
      Animated.sequence([
        Animated.timing(star1Anim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(star1Anim, {
          toValue: 0.2,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(star2Anim, {
          toValue: 0.9,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(star2Anim, {
          toValue: 0.1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(star3Anim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(star3Anim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={["#0F1021", "#2A1458", "#8B5CF6"]}
      locations={[0, 0.2, 1]}
      style={styles.container}
    >
      {/* Background Glowing Orb */}
      <Animated.View
        style={[
          styles.glowCircle,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.7],
            }),
            transform: [
              {
                scale: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
            ],
          },
        ]}
      />

      {/* Magical Twinkling Star Layer */}
      {staticStars.map((star, i) => {
        // Alag alag stars par randomized animation assign karne ke liye
        const assignedOpacity =
          i % 3 === 0 ? star1Anim : i % 3 === 1 ? star2Anim : star3Anim;
        return (
          <Animated.View
            key={star.id}
            style={[
              styles.starIcon,
              {
                top: star.top,
                left: star.left,
                opacity: assignedOpacity,
              },
            ]}
          >
            <Ionicons
              name="star"
              size={star.size}
              color={i % 2 === 0 ? "#FFE600" : "#FFF"}
            />
          </Animated.View>
        );
      })}

      {/* Safe Area Core Screen Layout Entry */}
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  glowCircle: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 200,
    backgroundColor: "#9333EA",
  },
  starIcon: {
    position: "absolute",
    zIndex: 0,
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
});
