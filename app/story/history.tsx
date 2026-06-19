import AppHeader from "@/components/ui/AppHeader";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ContentItem {
  id: string;
  title: string;
  image_url: string;
  category: "story" | "poems";
  isAIGenerated: boolean;
}

export default function HistoryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "ai">("all");

  const fetchData = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let combinedData: ContentItem[] = [];

    if (user) {
      const [{ data: stories }, { data: poems }] = await Promise.all([
        supabase
          .from("mystories")
          .select("id, title, image_url")
          .eq("user_id", user.id),
        supabase
          .from("mypoems")
          .select("id, title, image_url")
          .eq("user_id", user.id),
      ]);

      if (stories)
        combinedData.push(
          ...stories.map((i) => ({
            ...i,
            category: "story" as const,
            isAIGenerated: true,
          })),
        );
      if (poems)
        combinedData.push(
          ...poems.map((i) => ({
            ...i,
            category: "poems" as const,
            isAIGenerated: true,
          })),
        );
    }

    if (activeTab === "all") {
      const [{ data: pubStories }, { data: pubPoems }] = await Promise.all([
        supabase.from("stories").select("id, title, image_url"),
        supabase.from("poems").select("id, title, image_url"),
      ]);

      if (pubStories)
        combinedData.push(
          ...pubStories.map((i) => ({
            ...i,
            category: "story" as const,
            isAIGenerated: false,
          })),
        );

      if (pubPoems)
        combinedData.push(
          ...pubPoems.map((i) => ({
            ...i,
            category: "poems" as const,
            isAIGenerated: false,
          })),
        );
    }

    setItems(combinedData.sort((a, b) => b.id.localeCompare(a.id)));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = navigation.addListener("focus", fetchData);
    return unsubscribe;
  }, [activeTab]);

  const renderCard = ({ item }: { item: ContentItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push(
          `/${item.category}/${item.id}?type=${item.isAIGenerated ? "ai" : "public"}` as any,
        );
      }}
    >
      <Image source={{ uri: item.image_url }} style={styles.cardImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.overlay}
      />

      <View style={styles.cardContent}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                item.category === "story" ? "#8B5CF6" : "#06B6D4",
            },
          ]}
        >
          <Ionicons
            name={item.category === "story" ? "book" : "pencil"}
            size={10}
            color="#fff"
          />
          <Text style={styles.badgeText}>
            {item.category === "story" ? " Story" : " Poem"}
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <AppHeader title="My Library" />
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text style={styles.tabText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ai" && styles.activeTab]}
          onPress={() => setActiveTab("ai")}
        >
          <Text style={styles.tabText}>My Creations</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#8B5CF6" />
      ) : (
        <FlatList
          data={items}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(i) => i.id}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: "row", padding: 20, gap: 10 },
  tab: { padding: 10, borderRadius: 20, backgroundColor: "#333" },
  activeTab: { backgroundColor: "#8B5CF6" },
  tabText: { color: "#fff" },
  row: { justifyContent: "space-between", paddingHorizontal: 20 },
  card: {
    width: (width - 60) / 2,
    height: 220,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },
  cardImage: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject },
  cardContent: { position: "absolute", bottom: 10, left: 10 },
  badge: {
    flexDirection: "row",
    padding: 4,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  title: { color: "#fff", fontWeight: "bold" },
});
