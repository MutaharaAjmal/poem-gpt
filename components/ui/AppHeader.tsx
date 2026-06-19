import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function AppHeader({ title, onBack }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack || (() => router.back())}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 40 }} />
      {/* Header ko center karne ke liye spacer */}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#bfcddb",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#8B5CF6", // Aapka selected color #1E3A8A
  },
});
