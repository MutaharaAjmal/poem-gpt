import { useMemo } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
interface PoemSubtitleProps {
  bottomInset: number;
  textFade: Animated.Value;
  translateYAnimation: Animated.Value;
  text: string;
  currentWordIndex: number;
}

// 2. Component mein props ko type assign karein
export const PoemSubtitle = ({
  bottomInset,
  textFade,
  translateYAnimation,
  text,
  currentWordIndex,
}: PoemSubtitleProps) => {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <Animated.View
      style={[
        styles.bottomTextContainer,
        {
          paddingBottom: bottomInset + 12,
          opacity: textFade,
          transform: [{ translateY: translateYAnimation }],
        },
      ]}
    >
      <View style={styles.textBackground}>
        <Text style={styles.storyText}>
          {words.map((word: string, index: number) => {
            const isHighlighted = index === currentWordIndex;
            return (
              <Text
                key={index}
                style={
                  isHighlighted ? styles.highlightedWord : styles.normalWord
                }
              >
                {word}{" "}
              </Text>
            );
          })}
        </Text>
      </View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  storyText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 26,
  },
  // ── HIGHLIGHT STYLE TOKENS ───────────────────────────────────
  normalWord: {
    color: "#ffffff",
  },
  highlightedWord: {
    color: "#FBBF24", // Premium Amber Gold Highlight for better reading visibility
    textShadowColor: "rgba(251, 191, 36, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  bottomTextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 85,
    zIndex: 100,
  },
  textBackground: {
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});
