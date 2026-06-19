import { supabase } from "@/src/utils/supabase";
import { useAudioPlayer } from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PoemHeader } from "../components/PoemHeader";
import { PoemNavigation } from "../components/PoemNavigation";
import { PoemSubtitle } from "../components/PoemSubTitle";

export default function PoemDetailScreen() {
  const { id, type } = useLocalSearchParams();

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [poem, setPoem] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVoicePlaying, setIsVoicePlaying] = useState(true);
  const [musicVolumeLevel, setMusicVolumeLevel] = useState(1);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const isSpeakingRef = useRef(false);
  const flatListRef = useRef<FlatList>(null);
  const highlightIntervalRef = useRef<any>(null);
  const bgPlayer = useAudioPlayer(require("@/assets/audio/bg_music.mp3"));

  const zoomAnim = useRef(new Animated.Value(1)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(10)).current;

  // ── Music Volume Logic ──────────────────────────────────────
  useEffect(() => {
    if (!bgPlayer) return;
    bgPlayer.loop = true;
    try {
      if (musicVolumeLevel === 0) {
        bgPlayer.pause();
      } else {
        const volumeMap = [0, 0.08, 0.22, 0.45];
        bgPlayer.volume = volumeMap[musicVolumeLevel];
        if (!bgPlayer.playing) bgPlayer.play();
      }
    } catch (error) {
      console.log("Music Error:", error);
    }
  }, [musicVolumeLevel]);

  useEffect(() => {
    if (poem && isVoicePlaying) {
      // Thoda delay dein taake screen render ho jaye
      const timer = setTimeout(() => {
        playVoice();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      Speech.stop();
      isSpeakingRef.current = false;
    }
  }, [currentIndex, lang]);

  // ── Animations & Auto-Play ─────────────────────────────────
  useEffect(() => {
    if (!poem) return; // Poem load hone ka intezar karein

    Speech.stop();
    stopHighlightTimer();
    setCurrentWordIndex(-1);

    // Animations
    zoomAnim.setValue(1);
    textFadeAnim.setValue(0);
    textTranslateY.setValue(10);

    Animated.parallel([
      Animated.timing(zoomAnim, {
        toValue: 1.08,
        duration: 6000,
        useNativeDriver: true,
      }),
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
    ]).start();

    // Auto Play Logic
    if (isVoicePlaying) {
      playVoice();
    }
  }, [currentIndex, lang, poem]);

  // ── Orientation & Cleanup ──────────────────────────────────
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    if (id && type) {
      // id ke sath type ka hona bhi zaroori hai
      fetchPoem();
    }

    return () => {
      ScreenOrientation.unlockAsync();
      stopAllMedia();
    };
  }, [id, type]);

  const stopAllMedia = () => {
    Speech.stop();
    stopHighlightTimer();
    try {
      bgPlayer?.pause();
    } catch (e) {}
  };

  // ── Data & Speech Functions ────────────────────────────────
  const fetchPoem = async () => {
    try {
      const tableName = type === "ai" ? "mypoems" : "poems";

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        const rawStanzas = data.stanzas || data.paragraphs;
        const formatted = rawStanzas.map((stanza: string, index: number) => ({
          id: index.toString(),
          text_en: stanza,
          text_ur:
            data.stanzas_ur?.[index] ?? data.paragraphs_ur?.[index] ?? stanza,
          image:
            data.stanzas_images?.[index] ??
            data.paragraph_images?.[index] ??
            data.image_url,
        }));
        formatted.forEach((slide: any) => {
          if (slide.image) Image.prefetch(slide.image);
        });
        setPoem({ ...data, slides: formatted });
      }
    } catch (e) {
      console.error("Error fetching poem:", e);
    }
  };
  console.log(poem);

  const startHighlightTimer = (text: string) => {
    stopHighlightTimer();
    const words = text.split(" ");
    if (!words.length) return;
    let wordCounter = 0;
    setCurrentWordIndex(0);
    highlightIntervalRef.current = setInterval(() => {
      wordCounter++;
      if (wordCounter < words.length) setCurrentWordIndex(wordCounter);
      else stopHighlightTimer();
    }, 600);
  };

  const stopHighlightTimer = () => {
    if (highlightIntervalRef.current) {
      clearInterval(highlightIntervalRef.current);
      highlightIntervalRef.current = null;
    }
  };

  const playVoice = () => {
    if (!poem) return;
    const slide = poem.slides[currentIndex];
    const text = lang === "ur" ? slide.text_ur : slide.text_en;

    // Audio ko execute karne se pehle previous ko stop karein
    Speech.stop();
    isSpeakingRef.current = true; // Flag true karein

    setCurrentWordIndex(0);

    Speech.speak(text, {
      language: lang === "ur" ? "ur-PK" : "en-US",
      onBoundary: (event: any) => {
        const spokenText = text.substring(0, event.charIndex);
        const currentWordCount = spokenText.trim().split(/\s+/).length - 1;
        if (currentWordCount >= 0) setCurrentWordIndex(currentWordCount);
      },
      onDone: () => {
        if (!isSpeakingRef.current) return;

        isSpeakingRef.current = false;
        setCurrentWordIndex(-1);
        // Agar last slide nahi hai, toh next page par jayein
        if (currentIndex < poem.slides.length - 1) {
          // Sirf tab call karein jab hum voice mode mein hon
          handleNext();
        } else {
          setIsVoicePlaying(false);
        }
      },
      onError: (err) => {
        isSpeakingRef.current = false;
        console.log("TTS Error: ", err);
      },
    });
  };

  // const playVoice = () => {
  //   if (!poem) return;
  //   const slide = poem.slides[currentIndex];
  //   const text = lang === "ur" ? slide.text_ur : slide.text_en;
  //   startHighlightTimer(text);
  //   Speech.speak(text, {
  //     language: lang === "ur" ? "ur-PK" : "en-US",
  //     onDone: () => {
  //       if (currentIndex < poem.slides.length - 1) handleNext();
  //       else setIsVoicePlaying(false);
  //     },
  //   });
  // };

  const toggleVoice = () => {
    if (isVoicePlaying) {
      Speech.stop();
      stopHighlightTimer();
      setIsVoicePlaying(false);
    } else {
      setIsVoicePlaying(true);
      playVoice();
    }
  };

  const handleNext = () => {
    if (currentIndex < poem.slides.length - 1) {
      isSpeakingRef.current = false; // Flag reset
      Speech.stop();

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });

      // Auto-play ka trigger yahan se hata dein,
      // useEffect handle karega
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!poem) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }
  //  return <ActivityIndicator style={{ flex: 1 }} color="#8B5CF6" />;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <FlatList
        ref={flatListRef}
        data={poem.slides}
        windowSize={5}
        removeClippedSubviews={true}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
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
                  source={{ uri: item.image }}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.overlay} />
              </Animated.View>
            </View>
          );
        }}
      />

      <PoemHeader
        topInset={insets.top}
        onHomePress={() => {
          stopAllMedia();
          router.back();
        }}
        isVoicePlaying={isVoicePlaying}
        onToggleVoice={toggleVoice}
        musicVolumeLevel={musicVolumeLevel}
        onCycleVolume={() => setMusicVolumeLevel((prev) => (prev + 1) % 4)}
        lang={lang}
        showLangMenu={showLangMenu}
        onToggleLangMenu={() => setShowLangMenu(!showLangMenu)}
        onLanguageSwitch={(l: any) => {
          Speech.stop();
          setLang(l);
          setIsVoicePlaying(false);
        }}
      />

      <PoemNavigation
        currentIndex={currentIndex}
        totalSlides={poem.slides.length}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <PoemSubtitle
        bottomInset={insets.bottom}
        textFade={textFadeAnim}
        translateYAnimation={textTranslateY}
        text={
          lang === "en"
            ? poem.slides[currentIndex].text_en
            : poem.slides[currentIndex].text_ur
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
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
