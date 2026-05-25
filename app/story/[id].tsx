import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StoryDetail() {
  const { id } = useLocalSearchParams();
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [musicVolumeLevel, setMusicVolumeLevel] = useState(1);
  const [isVoicePlaying, setIsVoicePlaying] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  // ── ANIMATION VALUES ───────────────────────────────────────────
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(10)).current;

  // ── Background Music Setup ─────────────────────────────────────
  const bgPlayer = useAudioPlayer(require("@/assets/audio/bg_music.mp3"));
  bgPlayer.loop = true;

  useEffect(() => {
    if (!bgPlayer) return;
    try {
      if (musicVolumeLevel === 0) {
        if (bgPlayer.playing) bgPlayer.pause();
      } else if (musicVolumeLevel === 1) {
        bgPlayer.volume = 0.08;
        if (!bgPlayer.playing) bgPlayer.play();
      } else if (musicVolumeLevel === 2) {
        bgPlayer.volume = 0.22;
        if (!bgPlayer.playing) bgPlayer.play();
      } else if (musicVolumeLevel === 3) {
        bgPlayer.volume = 0.45;
        if (!bgPlayer.playing) bgPlayer.play();
      }
    } catch (error) {
      console.log("Volume setting error: ", error);
    }
  }, [musicVolumeLevel, bgPlayer]);

  // Initial Setup
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    if (id) fetchStoryData();

    if (bgPlayer && musicVolumeLevel !== 0) {
      bgPlayer.play();
    }

    return () => {
      ScreenOrientation.unlockAsync();
      Speech.stop();
      try {
        if (bgPlayer) bgPlayer.pause();
      } catch (e) {}
    };
  }, [id, bgPlayer]);

  // Kill background duplicate sound
  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      Speech.stop();
      try {
        if (bgPlayer) bgPlayer.pause();
      } catch (e) {}
    });
    return unsubscribeBlur;
  }, [navigation, bgPlayer]);

  // ── AUTOMATIC TRIGGER ON PAGE CHANGE ────────────────────────────
  useEffect(() => {
    Speech.stop();

    // Trigger cinematic Text & Image Animations
    zoomAnim.setValue(1);
    textFadeAnim.setValue(0);
    textTranslateY.setValue(10);

    Animated.parallel([
      Animated.timing(zoomAnim, {
        toValue: 1.08,
        duration: 6000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Normal page badalne par sound automatic chalega agar state active hai
    if (slides.length > 0 && isVoicePlaying) {
      playVoiceOver();
    }
  }, [currentIndex, slides]); // Removed 'lang' from here so language switch doesn't re-trigger auto play

  const fetchStoryData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;

      const formatted = data.paragraphs.map((para: string, index: number) => ({
        id: index.toString(),
        image_url: data.paragraph_images?.[index] ?? data.image_url,
        paragraph_en: para,
        paragraph_ur: data.paragraphs_ur?.[index] ?? "",
      }));
      setSlides(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const playVoiceOver = () => {
    if (!slides.length) return;
    const currentSlide = slides[currentIndex];
    const textToSpeak =
      lang === "en" ? currentSlide.paragraph_en : currentSlide.paragraph_ur;
    const voiceLanguage = lang === "en" ? "en-US" : "ur-PK";

    const currentPitch = lang === "ur" ? 1.0 : 0.94;
    const currentRate = lang === "ur" ? 0.92 : 0.84;

    Speech.speak(textToSpeak, {
      language: voiceLanguage,
      pitch: currentPitch,
      rate: currentRate,
      onDone: () => {
        if (currentIndex < slides.length - 1) {
          handleNextPage();
        } else {
          setIsVoicePlaying(false);
        }
      },
      onError: (err) => console.log("TTS Error: ", err),
    });
  };

  // FIXED: Language change par voice ruk jaye gi aur Pause ho jaye gi
  const handleLanguageSwitch = () => {
    Speech.stop(); // Voice ko usi waqt stop kiya
    setIsVoicePlaying(false); // UI par pause state lagayi taake play button show ho
    setLang((l) => (l === "en" ? "ur" : "en")); // Language badal di
  };

  // Play / Pause toggle handler
  const toggleVoiceSpeech = () => {
    if (isVoicePlaying) {
      Speech.stop();
      setIsVoicePlaying(false);
    } else {
      setIsVoicePlaying(true);
      // Minimal timeout taake state update ke baad instantly voice trigger ho
      setTimeout(() => {
        playVoiceOver();
      }, 30);
    }
  };

  const scrollToPage = (targetIndex: number) => {
    setCurrentIndex(targetIndex);
    flatListRef.current?.scrollToIndex({
      index: targetIndex,
      animated: true,
    });
  };

  const handleNextPage = () => {
    if (currentIndex < slides.length - 1) {
      scrollToPage(currentIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) {
      scrollToPage(currentIndex - 1);
    }
  };

  const onMomentumScrollEnd = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const cycleVolume = () => {
    setMusicVolumeLevel((prev) => (prev + 1) % 4);
  };

  if (loading || !slides.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const isCurrent = index === currentIndex;
          return (
            <View style={{ width, height, overflow: "hidden" }}>
              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  transform: [{ scale: isCurrent ? zoomAnim : 1 }],
                }}
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
                <View style={styles.overlay} />
              </Animated.View>
            </View>
          );
        }}
      />

      {/* HEADER SECTION */}
      <View style={[styles.header, { top: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => {
            Speech.stop();
            try {
              if (bgPlayer) bgPlayer.pause();
            } catch (e) {}
            router.back();
          }}
          style={styles.navBtn}
        >
          <Ionicons name="home-outline" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.centerControlPanel}>
          <TouchableOpacity
            style={styles.voicePlayBtn}
            onPress={toggleVoiceSpeech}
          >
            <Ionicons
              name={isVoicePlaying ? "pause" : "play"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>

          <View style={styles.innerDivider} />

          <TouchableOpacity
            style={styles.sliderContainer}
            onPress={cycleVolume}
          >
            <Ionicons
              name={musicVolumeLevel === 0 ? "volume-mute" : "musical-notes"}
              size={16}
              color={musicVolumeLevel === 0 ? "#EF4444" : "#8B5CF6"}
            />
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barSegment,
                  musicVolumeLevel >= 1
                    ? styles.segmentActive
                    : styles.segmentInactive,
                ]}
              />
              <View
                style={[
                  styles.barSegment,
                  musicVolumeLevel >= 2
                    ? styles.segmentActive
                    : styles.segmentInactive,
                ]}
              />
              <View
                style={[
                  styles.barSegment,
                  musicVolumeLevel >= 3
                    ? styles.segmentActive
                    : styles.segmentInactive,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.langBtn} onPress={handleLanguageSwitch}>
          <Text style={styles.langText}>{lang === "en" ? "اردو" : "EN"}</Text>
        </TouchableOpacity>
      </View>

      {/* NAVIGATION ARROWS */}
      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.arrow, styles.arrowLeft]}
          onPress={handlePrevPage}
        >
          <Ionicons name="chevron-back" size={32} color="#fff" />
        </TouchableOpacity>
      )}

      {currentIndex < slides.length - 1 && (
        <TouchableOpacity
          style={[styles.arrow, styles.arrowRight]}
          onPress={handleNextPage}
        >
          <Ionicons name="chevron-forward" size={32} color="#fff" />
        </TouchableOpacity>
      )}

      {/* SUBTITLE BOX AT BOTTOM */}
      <Animated.View
        style={[
          styles.bottomTextContainer,
          {
            paddingBottom: insets.bottom + 12,
            opacity: textFadeAnim,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        <View style={styles.textBackground}>
          <Text style={styles.storyText}>
            {lang === "en"
              ? currentSlide.paragraph_en
              : currentSlide.paragraph_ur}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centerContent: { justifyContent: "center", alignItems: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 100,
    position: "absolute",
    left: 0,
    right: 0,
  },
  navBtn: {
    // backgroundColor: "rgba(255, 255, 255, 0.75)",

    backgroundColor: "#8B5CF6",
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  langBtn: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 44,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },
  langText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  centerControlPanel: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  voicePlayBtn: {
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  innerDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginHorizontal: 12,
  },
  sliderContainer: { flexDirection: "row", alignItems: "center" },
  barTrack: {
    flexDirection: "row",
    marginLeft: 8,
    alignItems: "center",
    gap: 4,
  },
  barSegment: { width: 20, height: 6, borderRadius: 3 },
  segmentActive: { backgroundColor: "#8B5CF6" },
  segmentInactive: { backgroundColor: "rgba(255,255,255,0.25)" },

  bottomTextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 85,
    zIndex: 100,
  },
  textBackground: {
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  storyText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 26,
  },
  arrow: {
    position: "absolute",
    top: "48%",
    backgroundColor: "rgba(0,0,0,0.45)",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  arrowLeft: { left: 24 },
  arrowRight: { right: 44 },
});
