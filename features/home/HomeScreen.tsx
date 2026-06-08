import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { supabase } from "@/src/utils/supabase";
import { useAudioPlayer } from "expo-audio";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView } from "react-native";
import { CreatorSection } from "./components/CreatorSection";
import { HomeHeader } from "./components/HomeHeader";
import { MusicPill } from "./components/MusicPill";
import { StoryGrid } from "./components/StoryGrid";
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
  const [loadingCreators, setLoadingCreators] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const star1Anim = useRef(new Animated.Value(0.2)).current;
  const star2Anim = useRef(new Animated.Value(0.1)).current;
  const star3Anim = useRef(new Animated.Value(0.3)).current;

  // Audio setup
  const player = useAudioPlayer(require("@/assets/audio/bg_music.mp3"));
  // player.loop = true;
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

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <HomeHeader avatar={userAvatar} />
        <CreatorSection
          loading={loadingCreators}
          data={dbCreators}
          onPress={(id) => router.push(`/creator/${id}`)}
        />
        <StoryGrid
          loading={loading}
          data={dbStories}
          onPress={(id) => router.push(`/story/${id}`)}
        />
      </ScrollView>

      <MusicPill isMuted={isMuted} onPress={toggleMusic} />
      {/* </SafeAreaView> */}
    </ScreenWrapper>
  );
}
