import { supabase } from "@/src/utils/supabase";
import { useAudioPlayer } from "expo-audio";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { CreatorSection } from "./components/CreatorSection";
import { HomeHeader } from "./components/HomeHeader";
import { MusicPill } from "./components/MusicPill";
import { StoryGrid } from "./components/StoryGrid";

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // State
  const [data, setData] = useState<any[]>([]);
  const [dbCreators, setDbCreators] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "story" | "poem">("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // Animations
  const glowAnim = useRef(new Animated.Value(0)).current;
  const star1Anim = useRef(new Animated.Value(0.2)).current;
  const star2Anim = useRef(new Animated.Value(0.1)).current;
  const star3Anim = useRef(new Animated.Value(0.3)).current;

  // Audio setup
  const player = useAudioPlayer(require("@/assets/audio/bg_music.mp3"));
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

  const startStarBlinking = () => {
    [star1Anim, star2Anim, star3Anim].forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 900 + i * 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.2,
            duration: 900 + i * 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  };

  const fetchUserData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", session.user.id)
        .single();
      if (data?.avatar_url) setUserAvatar(data.avatar_url);
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    const [{ data: stories }, { data: poems }, { data: creators }] =
      await Promise.all([
        supabase.from("stories").select("id, title, author, image_url"),
        supabase.from("poems").select("id, title, author, image_url"),
        supabase
          .from("creators")
          .select("id, creator_name, story_name, image_url"),
      ]);

    const combined = [
      ...(stories?.map((s) => ({ ...s, type: "story" })) || []),
      ...(poems?.map((p) => ({ ...p, type: "poem" })) || []),
    ];
    setData(combined);
    setDbCreators(creators || []);
    setLoading(false);
    setLoadingCreators(false);
  };
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchContent();
    setRefreshing(false);
  }, []);
  useEffect(() => {
    startStarBlinking();
    fetchUserData();
    fetchContent();

    const unsubscribeBlur = navigation.addListener("blur", () =>
      player.pause(),
    );
    const unsubscribeFocus = navigation.addListener("focus", () => {
      if (!isMuted) player.play();
    });

    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, []);

  const filteredData = data.filter(
    (item) => filter === "all" || item.type === filter,
  );

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        refreshControl={
          // <--- Add this block
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8B5CF6"
            colors={["#8B5CF6"]}
          />
        }
      >
        <HomeHeader avatar={userAvatar} />

        <CreatorSection
          loading={loadingCreators}
          data={dbCreators}
          onPress={(id) => router.push(`/creator/${id}` as any)}
        />

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(["all", "story", "poem"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              style={[styles.tab, filter === tab && styles.activeTab]}
            >
              <Text
                style={[styles.tabText, filter === tab && styles.activeTabText]}
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#8B5CF6" />
        ) : (
          <StoryGrid
            loading={loading}
            data={filteredData}
            onPress={(id: string, type: string) => {
              const path = type === "story" ? `/story/${id}` : `/poems/${id}`;
              router.push(`${path}?type=public` as any);
            }}
          />
        )}
      </ScrollView>
      <MusicPill isMuted={isMuted} onPress={toggleMusic} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginVertical: 15,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  activeTab: { backgroundColor: "#8B5CF6" },
  tabText: { color: "#666", fontWeight: "bold" },
  activeTabText: { color: "#fff" },
});
