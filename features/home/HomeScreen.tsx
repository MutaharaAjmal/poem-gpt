import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const creators = [
  {
    id: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmn06FHw0VtlJRPm2XqEAl_PJw_JLzUii9Fg&s",
  },
  {
    id: "2",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSDQwcw2tL1N0iTGH3Vrbu2Ow6aSe-OKIyqA&s",
  },
  {
    id: "3",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy4gtkf4tleLXCDLI8VJmUBtW6_XAI-MxHyQ&s",
  },
  {
    id: "4",
    image:
      "https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg",
  },
];

interface StoryItem {
  id: string;
  title: string;
  author: string;
  image_url: string;
}
interface CreatorItem {
  id: string;
  creator_name: string;
  story_name: string;
  image_url: string;
}
export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [dbStories, setDbStories] = useState<StoryItem[]>([]);
  const [dbCreators, setDbCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCreators, setLoadingCreators] = useState(true); // Nayi state
  const [isMuted, setIsMuted] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const star1Anim = useRef(new Animated.Value(0.2)).current;
  const star2Anim = useRef(new Animated.Value(0.1)).current;
  const star3Anim = useRef(new Animated.Value(0.3)).current; // Naya animation ref mazeed stars ke liye

  // Audio setup
  const player = useAudioPlayer(require("@/assets/audio/bg_music.mp3"));
  player.loop = true;
  player.volume = 0.2;

  const toggleMusic = () => {
    if (player.playing) {
      player.pause();
      setIsMuted(true);
    } else {
      player.play();
      setIsMuted(false);
    }
  };

  // Twinkle/Blink Animation Functions
  const startStarBlinking = () => {
    // Star Group 1 Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(star1Anim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(star1Anim, {
          toValue: 0.2,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Star Group 2 Loop (Delayed pattern)
    Animated.loop(
      Animated.sequence([
        Animated.timing(star2Anim, {
          toValue: 0.9,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(star2Anim, {
          toValue: 0.1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Star Group 3 Loop (Tez twinkling ke liye)
    Animated.loop(
      Animated.sequence([
        Animated.timing(star3Anim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(star3Anim, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  const fetchUserAvatar = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      // Agar aapne 'profiles' table banayi hai jahan avatar url store hai
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", session.user.id)
        .single();

      if (data?.avatar_url) {
        setUserAvatar(data.avatar_url);
      }
    }
  };
  useEffect(() => {
    // Background Glow Animation Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Trigger Stars Blinking
    startStarBlinking();
    fetchCreatorsFromSupabase();
    fetchUserAvatar();
    fetchStoriesFromSupabase();

    // Sound logic
    if (!isMuted) {
      player.play();
    }

    const unsubscribeBlur = navigation.addListener("blur", () => {
      player.pause();
    });

    const unsubscribeFocus = navigation.addListener("focus", () => {
      if (!isMuted) {
        player.play();
      }
    });

    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, [isMuted]);
  const fetchCreatorsFromSupabase = async () => {
    setLoadingCreators(true);
    try {
      const { data, error } = await supabase
        .from("creators")
        .select("id, creator_name, story_name, image_url");

      if (error) throw error;
      setDbCreators(data || []);
    } catch (error: any) {
      console.error("Creators fetch error:", error.message);
    } finally {
      setLoadingCreators(false);
    }
  };
  const fetchStoriesFromSupabase = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("stories")
        .select("id, title, author, image_url");

      if (error) throw error;
      setDbStories(data || []);
    } catch (error: any) {
      console.error("Home fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const stars = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: Math.random() * 800, // Screen ki height
    left: Math.random() * 400, // Screen ki width
    size: Math.random() * 6 + 8, // 8px to 14px
    delay: Math.random() * 2000,
  }));

  return (
    <LinearGradient
      colors={["#0F1021", "#2A1458", "#8B5CF6"]}
      locations={[0, 0.2, 1]} // 30% mark par transition
      style={styles.container}
    >
      {/* Background Glow animation */}
      <Animated.View
        style={[
          styles.glowCircle,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.7],
            }),
            transform: [
              {
                scale: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
            ],
          },
        ]}
      />
      {/* ==================== MAGICAL BLINKING STARS (TOTAL 8) ==================== */}
      {/* Top Left Star */}
      {/* <Animated.View
        style={[styles.starIcon, { top: 110, left: 25, opacity: star1Anim }]}
      >
        <Ionicons name="star" size={14} color="#FFE600" />
      </Animated.View> */}
      {/* Top Right Star (Near profile) */}
      {/* <Animated.View
        style={[styles.starIcon, { top: 130, right: 110, opacity: star3Anim }]}
      >
        <Ionicons name="star" size={10} color="#FFF" />
      </Animated.View> */}
      {/* Mid Left Star (Creators block ke paas) */}
      {/* <Animated.View
        style={[styles.starIcon, { top: 230, left: 45, opacity: star2Anim }]}
      >
        <Ionicons name="star" size={12} color="#FFF" style={{ opacity: 0.8 }} />
      </Animated.View> */}
      {/* Mid Right Star */}
      {/* <Animated.View
        style={[styles.starIcon, { top: 280, right: 40, opacity: star1Anim }]}
      >
        <Ionicons name="star" size={16} color="#FFE600" />
      </Animated.View> */}
      {/* Center Background Star */}
      {/* <Animated.View
        style={[styles.starIcon, { top: 420, left: "55%", opacity: star3Anim }]}
      >
        <Ionicons name="star" size={11} color="#FFE600" />
      </Animated.View> */}
      {/* Lower Left Star */}
      {/* <Animated.View
        style={[styles.starIcon, { top: 510, left: 30, opacity: star2Anim }]}
      >
        <Ionicons name="star" size={15} color="#FFF" />
      </Animated.View> */}
      {/* Lower Right Star */}
      {/* <Animated.View
        style={[styles.starIcon, { top: 620, right: 35, opacity: star1Anim }]}
      >
        <Ionicons name="star" size={13} color="#FFE600" />
      </Animated.View> */}
      {/* Bottom Center Star */}
      {/* <Animated.View
        style={[
          styles.starIcon,
          { bottom: 50, left: "35%", opacity: star3Anim },
        ]}
      >
        <Ionicons name="star" size={12} color="#FFF" style={{ opacity: 0.7 }} />
      </Animated.View> */}
      {/* ========================================================================= */}
      {/* // 1. Array generate karein (render ke bahar ya state mein) */}
      {/* // 2. Return mein ye map laga dein (SafeAreaView ke bilkul neeche): */}
      {stars.map((star, i) => (
        <Animated.View
          key={star.id}
          style={[
            styles.starIcon,
            {
              top: star.top,
              left: star.left,
              opacity: star1Anim, // Ya apna koi custom animation ref
            },
          ]}
        >
          <Ionicons
            name="star"
            size={star.size}
            color={i % 2 === 0 ? "#FFE600" : "#FFF"}
          />
        </Animated.View>
      ))}
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.heading}>Where Stories{"\n"}Made By You</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconBtn} onPress={toggleMusic}>
                <Ionicons
                  name={isMuted ? "volume-mute" : "volume-high"}
                  size={22}
                  color={isMuted ? "#EF4444" : "#10B981"}
                />
              </TouchableOpacity>
              <Image
                source={{
                  uri: userAvatar || "https://via.placeholder.com/150",
                }}
                style={styles.profile}
              />
            </View>
          </View>

          {/* TOP CREATORS */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>Top Creators</Text>
              <Text style={styles.viewAll}>View All</Text>
            </View>
            {loadingCreators ? (
              <ActivityIndicator
                size="small"
                color="#8B5CF6"
                style={{
                  marginVertical: 20,
                  // alignSelf: "flex-start",
                  marginLeft: 20,
                }}
              />
            ) : (
              <FlatList
                horizontal
                data={dbCreators}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.creatorCard}
                    onPress={() => router.push(`/creator/${item.id}`)}
                  >
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.creatorImage}
                    />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {/* STORIES (DYNAMIC FROM SUPABASE) */}
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
                {dbStories.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.storyCard}
                    onPress={() => router.push(`/story/${item.id}`)}
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
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  heading: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 42,
    letterSpacing: 0.5,
  },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  // profile: { width: 45, height: 45, borderRadius: 25 },
  profile: {
    width: 55,
    height: 55,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#8B5CF6",
  },
  section: { marginTop: 30, paddingHorizontal: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  viewAll: { color: "#B8B8D2", fontSize: 13 },
  creatorCard: { marginRight: 15 },
  creatorImage: {
    width: 65,
    height: 65,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#8B5CF6", // Aapka pasandida color use kiya yahan
  },
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
  glowCircle: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 200,
    backgroundColor: "#9333EA",
  },
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
  creatorName: {
    color: "#fff",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "700",
  },
  storyName: {
    color: "#B8B8D2",
    fontSize: 10,
    marginTop: 2,
  },
});
