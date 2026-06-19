import {
  LangKey,
  LANGUAGES,
  StoryHeader,
} from "@/features/story/components/StoryHeader";
import { StoryNavigation } from "@/features/story/components/StoryNavigation";
import { StorySubtitle } from "@/features/story/components/StorySubTitle";
import { useAppStore } from "@/src/store/useAppStore";
import { supabase } from "@/src/utils/supabase";
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
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetailScreen() {
  const { id, type } = useLocalSearchParams();
  const activeStory = useAppStore((state) => state.activeStory); // Global data
  console.log(activeStory);

  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<LangKey>("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [musicVolumeLevel, setMusicVolumeLevel] = useState(1);
  const [isVoicePlaying, setIsVoicePlaying] = useState(true);

  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const highlightIntervalRef = useRef<any>(null);

  const flatListRef = useRef<FlatList>(null);
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(10)).current;

  const bgPlayer = useAudioPlayer(require("@/assets/audio/bg_music.mp3"));
  bgPlayer.loop = true;

  useEffect(() => {
    if (activeStory) {
      processData(activeStory);
    } else {
      // Fallback agar store khali ho (refresh karne par)
      fetchStoryData();
    }
  }, [activeStory]);

  const processData = (data: any) => {
    const rawContent =
      data.paragraphs || data.stanzas || (data.content ? [data.content] : []);
    const formatted = rawContent.map((para: string, index: number) => {
      const url = data.paragraph_images?.[index] ?? data.image_url;

      // PRE-FETCHING: Images ko background mein load karein
      if (url) Image.prefetch(url);

      return {
        id: index.toString(),
        image_url: url,
        paragraph_en: para,
        paragraph_ur: data.paragraphs_ur?.[index] ?? "",
      };
    });
    setSlides(formatted);
    setLoading(false);
  };

  // ── Volume control ──────────────────────────────────────────
  useEffect(() => {
    if (!bgPlayer) return;
    try {
      if (musicVolumeLevel === 0) {
        if (bgPlayer.playing) bgPlayer.pause();
      } else {
        const volumeMap = [0, 0.08, 0.22, 0.45];
        bgPlayer.volume = volumeMap[musicVolumeLevel];
        if (!bgPlayer.playing) bgPlayer.play();
      }
    } catch (error) {
      console.log("Volume setting error: ", error);
    }
  }, [musicVolumeLevel, bgPlayer]);

  // ── Initial setup ───────────────────────────────────────────
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    if (id && type) {
      // id ke sath type ka hona bhi zaroori hai
      fetchStoryData();
    }
    if (bgPlayer && musicVolumeLevel !== 0) bgPlayer.play();

    return () => {
      ScreenOrientation.unlockAsync();
      Speech.stop();
      stopHighlightTimer();
      try {
        if (bgPlayer) bgPlayer.pause();
      } catch (e) {}
    };
  }, [id, bgPlayer]);

  // ── Pause on screen blur ────────────────────────────────────
  useEffect(() => {
    const unsub = navigation.addListener("blur", () => {
      Speech.stop();
      stopHighlightTimer();
      try {
        if (bgPlayer) bgPlayer.pause();
      } catch (e) {}
    });
    return unsub;
  }, [navigation, bgPlayer]);

  // ── Slide change: animation + autoplay ─────────────────────
  useEffect(() => {
    Speech.stop();
    stopHighlightTimer();
    setCurrentWordIndex(-1);

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

    if (slides.length > 0 && isVoicePlaying) playVoiceOver();
  }, [currentIndex, slides]);

  // ── Data fetch ──────────────────────────────────────────────

  const fetchStoryData = async () => {
    try {
      setLoading(true);

      let tableName =
        type === "ai"
          ? window.location.pathname.includes("poems")
            ? "mypoems"
            : "mystories"
          : "stories";

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }

      const rawContent =
        data.paragraphs || data.stanzas || (data.content ? [data.content] : []);

      if (rawContent.length === 0) {
        console.warn("Content is empty! Check your column names.");
      }

      const formatted = rawContent.map((para: string, index: number) => ({
        id: index.toString(),
        image_url: data.paragraph_images?.[index] ?? data.image_url,
        paragraph_en: para,
        paragraph_ur: data.paragraphs_ur?.[index] ?? "",
      }));

      setSlides(formatted);
    } catch (e) {
      console.error("Critical Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };
  // ── Highlight timer ─────────────────────────────────────────
  const startHighlightTimer = (text: string, rate: number) => {
    stopHighlightTimer();
    const words = text.split(" ");
    if (!words.length) return;

    const langConfig = LANGUAGES.find((l) => l.key === lang);
    const baseMsPerWord = langConfig?.isRtl ? 480 : 400;
    const msPerWord = baseMsPerWord / rate;

    let wordCounter = 0;
    setCurrentWordIndex(0);

    highlightIntervalRef.current = setInterval(() => {
      wordCounter++;
      if (wordCounter < words.length) {
        setCurrentWordIndex(wordCounter);
      } else {
        stopHighlightTimer();
      }
    }, msPerWord);
  };

  const stopHighlightTimer = () => {
    if (highlightIntervalRef.current) {
      clearInterval(highlightIntervalRef.current);
      highlightIntervalRef.current = null;
    }
  };

  // ── Voice over ──────────────────────────────────────────────
  // const playVoiceOver = () => {
  //   if (!slides.length) return;
  //   const currentSlide = slides[currentIndex];
  //   const langConfig = LANGUAGES.find((l) => l.key === lang) ?? LANGUAGES[0];

  //   const textToSpeak =
  //     lang === "en"
  //       ? currentSlide.paragraph_en
  //       : currentSlide.paragraph_ur || currentSlide.paragraph_en;

  //   startHighlightTimer(textToSpeak, langConfig.rate);

  //   Speech.speak(textToSpeak, {
  //     language: langConfig.ttsCode,
  //     pitch: langConfig.pitch,
  //     rate: langConfig.rate,
  //     onDone: () => {
  //       stopHighlightTimer();
  //       if (currentIndex < slides.length - 1) {
  //         handleNextPage();
  //       } else {
  //         setIsVoicePlaying(false);
  //       }
  //     },
  //     onError: (err) => {
  //       console.log("TTS Error: ", err);
  //       stopHighlightTimer();
  //     },
  //   });
  // };
  const playVoiceOver = () => {
    if (!slides.length) return;
    const currentSlide = slides[currentIndex];
    const langConfig = LANGUAGES.find((l) => l.key === lang) ?? LANGUAGES[0];

    const textToSpeak =
      lang === "en"
        ? currentSlide.paragraph_en
        : currentSlide.paragraph_ur || currentSlide.paragraph_en;

    const words = textToSpeak.split(" ");
    setCurrentWordIndex(0); // Start from first word

    Speech.speak(textToSpeak, {
      language: langConfig.ttsCode,
      pitch: langConfig.pitch,
      rate: langConfig.rate,
      // Audio ke sath sync karne ke liye 'onBoundary'
      onBoundary: (event: any) => {
        const spokenText = textToSpeak.substring(0, event.charIndex);
        const currentWordCount = spokenText.trim().split(/\s+/).length - 1;

        // Safety check
        if (currentWordCount >= 0 && currentWordCount < words.length) {
          setCurrentWordIndex(currentWordCount);
        }
      },
      onDone: () => {
        setCurrentWordIndex(-1); // Finish line
        if (currentIndex < slides.length - 1) {
          handleNextPage();
        } else {
          setIsVoicePlaying(false);
        }
      },
      onError: (err) => console.log("TTS Error: ", err),
    });
  };

  // ── Language switch ─────────────────────────────────────────
  const handleLanguageSwitch = (newLang: LangKey) => {
    Speech.stop();
    stopHighlightTimer();
    setCurrentWordIndex(-1);
    setIsVoicePlaying(false);
    setShowLangMenu(false);
    setLang(newLang);
  };

  // ── Voice toggle ────────────────────────────────────────────
  const toggleVoiceSpeech = () => {
    if (isVoicePlaying) {
      Speech.stop();
      stopHighlightTimer();
      setIsVoicePlaying(false);
    } else {
      setIsVoicePlaying(true);
      setTimeout(() => playVoiceOver(), 30);
    }
  };

  // ── Navigation ──────────────────────────────────────────────
  const scrollToPage = (targetIndex: number) => {
    setCurrentIndex(targetIndex);
    flatListRef.current?.scrollToIndex({ index: targetIndex, animated: true });
  };

  const handleNextPage = () => {
    if (currentIndex < slides.length - 1) scrollToPage(currentIndex + 1);
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) scrollToPage(currentIndex - 1);
  };

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  const cycleVolume = () => setMusicVolumeLevel((prev) => (prev + 1) % 4);

  if (loading || !slides.length) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const currentSlide = slides[currentIndex];
  const langConfig = LANGUAGES.find((l) => l.key === lang) ?? LANGUAGES[0];

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <FlatList
        ref={flatListRef}
        data={slides}
        initialNumToRender={1}
        windowSize={5}
        maxToRenderPerBatch={1}
        horizontal
        pagingEnabled
        removeClippedSubviews={true} // Screen se bahar wali images ko unmount karega
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

      <StoryHeader
        topInset={insets.top}
        onHomePress={() => {
          Speech.stop();
          stopHighlightTimer();
          try {
            bgPlayer?.pause();
          } catch (e) {}
          router.back();
        }}
        isVoicePlaying={isVoicePlaying}
        onToggleVoice={toggleVoiceSpeech}
        musicVolumeLevel={musicVolumeLevel}
        onCycleVolume={cycleVolume}
        lang={lang}
        showLangMenu={showLangMenu}
        onToggleLangMenu={() => setShowLangMenu((v) => !v)}
        onLanguageSwitch={handleLanguageSwitch}
      />

      <StoryNavigation
        currentIndex={currentIndex}
        totalSlides={slides.length}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />

      <StorySubtitle
        bottomInset={insets.bottom}
        textFade={textFadeAnim}
        translateYAnimation={textTranslateY}
        text={
          lang === "en"
            ? currentSlide.paragraph_en
            : currentSlide.paragraph_ur || currentSlide.paragraph_en
        }
        currentWordIndex={currentWordIndex}
      />
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
});
