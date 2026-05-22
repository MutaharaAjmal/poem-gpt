import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function CreatorProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [creator, setCreator] = useState<any>(null);

  useEffect(() => {
    fetchCreatorData();
  }, [id]);

  const [stories, setStories] = useState<any[]>([]); // Multiple stories list
  //   const [storyId, setStoryId] = useState<string | null>(null);
  const fetchCreatorData = async () => {
    // 1. Fetch Creator Info
    const { data: creatorData } = await supabase
      .from("creators")
      .select("*")
      .eq("id", id)
      .single();

    setCreator(creatorData);

    // 2. Fetch ALL stories linked to this creator ID (Relational Query)
    if (creatorData) {
      const { data: storiesData } = await supabase
        .from("stories")
        .select("id, title, image_url")
        .eq("creator_id", id); // Direct link

      setStories(storiesData || []);
    }
  };

  if (!creator)
    return (
      <ActivityIndicator
        style={{ marginTop: 100 }}
        size="large"
        color="#8B5CF6"
      />
    );
  return (
    <LinearGradient
      colors={["#0F1021", "#1A1B3A", "#2A1458"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image with Glow */}
        <View style={styles.headerImageContainer}>
          <Image
            source={{ uri: creator.image_url }}
            style={styles.headerImage}
          />
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Creator Info */}
        <View style={styles.profileSection}>
          <Text style={styles.creatorName}>{creator.creator_name}</Text>
          <Text style={styles.bio}>Digital Storyteller & Dreamer ✍️</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Stories</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>1.2k</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Works by {creator.creator_name}</Text>
        {/* <TouchableOpacity
          style={styles.storyCard}
          onPress={() => router.push(`/story/${item.id}`)}
        >
          <Text style={styles.storyTitle}>{creator.story_name}</Text>
          <Ionicons name="book-outline" size={20} color="#8B5CF6" />
        </TouchableOpacity> */}
        <View style={styles.grid}>
          {stories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.storyCard}
              onPress={() => router.push(`/story/${item.id}`)}
            >
              <Image source={{ uri: item.image_url }} style={styles.cardImg} />
              <Text style={styles.storyTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerImageContainer: { height: 300, width: "100%", marginBottom: -50 },
  headerImage: { width: "100%", height: "100%" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  profileSection: {
    backgroundColor: "#0F1021",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
  },
  creatorName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  bio: { color: "#B8B8D2", textAlign: "center", marginTop: 10 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    alignItems: "center",
  },
  statBox: { alignItems: "center" },
  statNum: { color: "#fff", fontSize: 18, fontWeight: "800" },
  statLabel: { color: "#B8B8D2", fontSize: 12 },
  followBtn: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  followText: { color: "#fff", fontWeight: "700" },
  sectionTitle: { color: "#fff", margin: 20, fontSize: 18, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  storyCard: {
    width: "47%",
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    overflow: "hidden",
  },
  cardImg: {
    width: "100%",
    height: 120,
  },
  storyTitle: { color: "#fff", fontSize: 16 },
});
