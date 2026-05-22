import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    await SecureStore.setItemAsync("hasSeenOnboarding", "true");
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar (Only visible on Screen 1) */}
      <View style={styles.topBar}>
        {currentStep === 1 ? (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setCurrentStep(1)}>
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content Body */}
      <View style={styles.contentContainer}>
        {currentStep === 1 ? (
          /* SCREEN 1: Introduction */
          <View style={styles.slide}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#F3E8FF" }]}
            >
              <Ionicons name="sparkles" size={64} color="#8B5CF6" />
            </View>
            <Text style={styles.title}>AI Poetry Studio</Text>
            <Text style={styles.description}>
              Unlock your inner poet instantly. Craft beautiful poems, rhyming
              sonnets, and deep verses in seconds with our advanced AI Engine.
            </Text>
          </View>
        ) : (
          /* SCREEN 2: Features & Let's Start */
          <View style={styles.slide}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#FCE7F3" }]}
            >
              <Ionicons name="language" size={64} color="#EC4899" />
            </View>
            <Text style={styles.title}>Urdu & Voice Aloud</Text>
            <Text style={styles.description}>
              Write traditional Urdu Ghazals or beautiful English stories. Paste
              your own poetry and let the AI read it aloud with natural
              emotional narration!
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Controls Indicator & Buttons */}
      <View style={styles.bottomContainer}>
        {/* Step Dots Indicators */}
        <View style={styles.indicatorContainer}>
          <View
            style={[
              styles.dot,
              currentStep === 1 ? styles.activeDot : styles.inactiveDot,
            ]}
          />
          <View
            style={[
              styles.dot,
              currentStep === 2 ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleNext}>
          <Text style={styles.actionButtonText}>
            {currentStep === 1 ? "Next" : "Let's Start 🚀"}
          </Text>
          <Ionicons
            name={currentStep === 1 ? "arrow-forward" : "checkmark-circle"}
            size={20}
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFE",
  },
  topBar: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  slide: {
    alignItems: "center",
    width: width - 60,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#8B5CF6",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "#E5E7EB",
  },
  actionButton: {
    backgroundColor: "#8B5CF6",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
