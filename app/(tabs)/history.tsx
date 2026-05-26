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

interface StoryItem {
  id: string;
  title: string;
  author?: string;
  image_url: string;
  tags?: string[];
  isAIGenerated?: boolean;
}

export default function HistoryScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "ai">("all");
  useEffect(() => {
    fetchAllStories(activeTab);

    const unsubscribe = navigation.addListener("focus", () => {
      fetchAllStories(activeTab);
    });
    return unsubscribe;
  }, [navigation, activeTab]);

  // FIXED: Accepts currentTab directly to completely bypass async state delay
  const fetchAllStories = async (currentTab: "all" | "ai") => {
    try {
      setLoading(true);
      let combinedData: StoryItem[] = [];

      // 1. Always Fetch from 'mystories' (AI Creations)
      const { data: myData, error: myError } = await supabase
        .from("mystories")
        .select("id, title, image_url, tags")
        .order("created_at", { ascending: false });

      if (!myError && myData) {
        const formattedMyData = myData.map((item) => ({
          ...item,
          author: "Me (AI)",
          isAIGenerated: true,
        }));
        combinedData = [...combinedData, ...formattedMyData];
      }

      // 2. FIXED: Fetch from normal 'stories' table only if current tab context is 'all'
      if (currentTab === "all") {
        const { data: publicData, error: publicError } = await supabase
          .from("stories")
          .select("id, title, author, image_url, tags");

        if (!publicError && publicData) {
          const formattedPublicData = publicData.map((item) => ({
            ...item,
            isAIGenerated: false,
          }));
          // Merge both arrays seamlessly
          combinedData = [...combinedData, ...formattedPublicData];
        }
      }

      setStories(combinedData);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryPress = (item: StoryItem) => {
    const storyType = item.isAIGenerated ? "ai" : "public";
    router.push(`/story/${item.id}?type=${storyType}` as any);
  };

  const renderStoryCard = ({ item }: { item: StoryItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handleStoryPress(item)}
    >
      <Image source={{ uri: item.image_url }} style={styles.cardImage} />
      <LinearGradient
        colors={["transparent", "rgba(15, 16, 33, 0.9)"]}
        style={styles.cardOverlay}
      />
      <View style={styles.cardContent}>
        {item.isAIGenerated && (
          <View style={styles.aiBadge}>
            <Ionicons
              name="sparkles"
              size={10}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.aiBadgeText}>AI Story</Text>
          </View>
        )}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.cardAuthor}>
          {/* {item.author || "Unknown"} */}
          {item.author === "Me (AI)" ? "By Me" : item.author}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    // <LinearGradient
    //   colors={["#0F1021", "#1A1B3A", "#2A1458"]}
    //   style={styles.container}
    // >
    <ScreenWrapper>
      {/* <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}> */}
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.heading}>Library History</Text>
        <Text style={styles.subheading}>
          Your collection of public and AI generated magical books
        </Text>
      </View>

      {/* PREMIUM TAB FILTERS */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "all" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            All Stories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "ai" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("ai")}
        >
          <Text
            style={[styles.tabText, activeTab === "ai" && styles.activeTabText]}
          >
            My AI Creations
          </Text>
        </TouchableOpacity>
      </View>

      {/* LOADING & LIST */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      ) : stories.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="book-outline"
            size={50}
            color="rgba(255,255,255,0.2)"
          />
          <Text style={styles.emptyText}>No stories found here yet!</Text>
        </View>
      ) : (
        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          renderItem={renderStoryCard}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
      {/* </SafeAreaView> */}
    </ScreenWrapper>

    // </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingHorizontal: 24, marginTop: 15, marginBottom: 20 },
  heading: { color: "#fff", fontSize: 28, fontWeight: "900" },
  subheading: { color: "#B8B8D2", fontSize: 13, marginTop: 5 },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  activeTabButton: { backgroundColor: "#8B5CF6", borderColor: "#A855F7" },
  tabText: { color: "#B8B8D2", fontSize: 13, fontWeight: "600" },
  activeTabText: { color: "#fff" },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  card: {
    width: (width - 64) / 2,
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
  cardOverlay: { ...StyleSheet.absoluteFillObject },
  cardContent: { position: "absolute", bottom: 14, left: 14, right: 14 },
  cardTitle: { color: "#fff", fontSize: 15, fontWeight: "700", lineHeight: 20 },
  cardAuthor: { color: "#B8B8D2", fontSize: 11, marginTop: 4 },
  emptyText: { color: "rgba(255,255,255,0.4)", marginTop: 15, fontSize: 14 },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(139, 92, 246, 0.8)",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginBottom: 6,
  },
  aiBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
