import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ResultViewProps {
  title: string;
  generatedStoryParagraphs: string[];
  resetFormState: () => void;
}

export default function ResultView({
  title,
  generatedStoryParagraphs,
  resetFormState,
}: ResultViewProps) {
  const router = useRouter();

  return (
    <LinearGradient colors={["#1E3A8A", "#0F172A"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Animated Success Badge Layout */}
          <View style={styles.resultHeader}>
            <View style={styles.successBadge}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.successBadgeText}>
                Magical Story Generated!
              </Text>
            </View>
          </View>

          {/* Premium Digital Kids Book Title Frame */}
          <Text style={styles.resultBookTitle}>✨ {title} ✨</Text>
          <View style={styles.dividerAccent} />

          {/* Story Paragraph Cards - Kids Readable Font & Spacing */}
          <View style={styles.storyBodyContainer}>
            {generatedStoryParagraphs.map((para, idx) => (
              <LinearGradient
                key={idx}
                colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
                style={styles.paragraphCard}
              >
                <View style={styles.badgeRow}>
                  <Text style={styles.paragraphNumTag}>Page {idx + 1}</Text>
                  <Ionicons name="sparkles" size={14} color="#F472B6" />
                </View>
                <Text style={styles.paragraphText}>{para}</Text>
              </LinearGradient>
            ))}
          </View>

          {/* Action Footer Controls */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[styles.footerBtn, styles.secondaryBtn]}
              onPress={resetFormState}
            >
              <Ionicons
                name="reload"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.btnText}>Make Another</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerBtn, styles.primaryBtn]}
              onPress={() => {
                resetFormState();
                router.push("/(tabs)/history");
              }}
            >
              <Text style={styles.btnText}>My Library</Text>
              <Ionicons
                name="book"
                size={18}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 50 },
  resultHeader: { alignItems: "center", marginBottom: 15 },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(252, 211, 77, 0.15)",
    borderWidth: 1.5,
    borderColor: "#FCD34D",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  successBadgeText: {
    color: "#FBBF24",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  resultBookTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 38,
  },
  dividerAccent: {
    height: 4,
    backgroundColor: "#EC4899",
    width: 80,
    borderRadius: 2,
    marginTop: 15,
    marginBottom: 30,
    alignSelf: "center",
  },
  storyBodyContainer: { width: "100%", marginBottom: 20 },
  paragraphCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paragraphNumTag: {
    color: "#38BDF8",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  paragraphText: {
    color: "#F1F5F9",
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "500",
    textAlign: "left",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
    marginTop: 10,
  },
  footerBtn: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  primaryBtn: {
    backgroundColor: "#1E3A8A",
    borderWidth: 1.5,
    borderColor: "#3B82F6",
    shadowColor: "#3B82F6",
  },
  secondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
  },
});
