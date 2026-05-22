import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showAvatar?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  showAvatar = true,
}: AppHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.textContainer}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>

      {showAvatar && (
        <TouchableOpacity style={styles.avatarButton}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
            }}
            style={styles.avatar}
          />
          <View style={styles.badge} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#FAFAFE",
  },
  textContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    color: "#8B5CF6",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F2937",
  },
  avatarButton: {
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  badge: {
    position: "absolute",
    right: 1,
    bottom: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFF",
  },
});
