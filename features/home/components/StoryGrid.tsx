import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface StoryGridProps {
  loading?: boolean;
  data: any[];
  onPress: (item: any) => void;
}

export const StoryGrid = ({ loading, data, onPress }: StoryGridProps) => {
  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>My Collection</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="small"
          color="#8B5CF6"
          style={{ marginTop: 20 }}
        />
      ) : (
        <View style={styles.grid}>
          {data.map((item) => (
            <TouchableOpacity
              key={`${item.id}-${item.type}`}
              style={styles.storyCard}
              onPress={() => onPress(item)}
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.storyImage}
              />

              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.9)"]}
                style={styles.overlay}
              >
                <Text style={styles.storyTitle}>{item.title}</Text>
                <Text style={styles.storyAuthor}>
                  {item.author.toLowerCase().includes("by")
                    ? item.author
                    : `By ${item.author}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  section: { marginTop: 10, paddingHorizontal: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  viewAll: { color: "#B8B8D2", fontSize: 13 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  storyCard: {
    width: "48%",
    height: 240,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#222",
    elevation: 10,
  },
  storyImage: { width: "100%", height: "100%", transform: [{ scale: 1.05 }] },

  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
    justifyContent: "flex-end",
    height: "50%",
  },
  storyTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  storyAuthor: { color: "#ddd", fontSize: 12, marginTop: 5 },

  starIcon: {
    position: "absolute",
    zIndex: 0,
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },

  storyName: {
    color: "#B8B8D2",
    fontSize: 10,
    marginTop: 2,
  },
});
