import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface PoemNavigationProps {
  currentIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
}

export const PoemNavigation = ({
  currentIndex,
  totalSlides,
  onPrev,
  onNext,
}: PoemNavigationProps) => {
  return (
    <>
      {/* NAVIGATION ARROWS */}
      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.arrow, styles.arrowLeft]}
          onPress={onPrev}
        >
          <Ionicons name="chevron-back" size={32} color="#fff" />
        </TouchableOpacity>
      )}

      {currentIndex < totalSlides - 1 && (
        <TouchableOpacity
          style={[styles.arrow, styles.arrowRight]}
          onPress={onNext}
        >
          <Ionicons name="chevron-forward" size={32} color="#fff" />
        </TouchableOpacity>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  arrow: {
    position: "absolute",
    top: "48%",
    backgroundColor: "rgba(0,0,0,0.45)",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  arrowLeft: { left: 24 },
  arrowRight: { right: 44 },
});
