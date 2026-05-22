import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ParagraphCard } from "../../components/ui/ParagraphCard";
import { supabase } from "../../src/utils/supabase";

export default function StoryDetail() {
  const { id } = useLocalSearchParams();

  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    if (id) fetchStoryData();
    return () => {
      ScreenOrientation.unlockAsync();
      Speech.stop();
    };
  }, [id]);

  const fetchStoryData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      const formatted = data.paragraphs.map((para: string, index: number) => {
        // Agar paragraph_images array mojood hai aur usme is index ki image hai to wo use ho, nahi to main cover image chalay
        const specificImage =
          data.paragraph_images && data.paragraph_images[index]
            ? data.paragraph_images[index]
            : data.image_url;

        return {
          id: index.toString(),
          image_url: specificImage, // Ab har slide ki apni specific image hogi
          paragraph_en: para,
          paragraph_ur: data.paragraphs_ur ? data.paragraphs_ur[index] : "",
        };
      });

      setSlides(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#1E3A8A" />
    );

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={width}
        // --- IN PROPERTIES KO ADD KAREIN ---
        windowSize={5} // Yeh 5 slides ka data memory mein pre-render rakhta hai (Current, 2 peeche, 2 aage)
        initialNumToRender={2} // Pehli baar mein kam se kam 2 slides render karein
        maxToRenderPerBatch={2} // Ek batch mein zyada loading burden na dalein
        removeClippedSubviews={false} // LANDSCAPE mein smoothly images memory mein rakhne ke liye false rakhein
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <View
            style={{ width: width, height: height, backgroundColor: "#1E3A8A" }}
          >
            {/* Background color black ki jagah dark blue '#1E3A8A' rakhne se image load hote waqt premium feel aati hai blank screen nahi lagti */}

            <ImageBackground
              source={{ uri: item.image_url }}
              style={styles.fullScreenImg}
              resizeMode="cover"
            >
              {/* Baki ka aap ka renderItem ka code wahi rahega... */}
              <View style={styles.overlay} />
              <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                <TouchableOpacity
                  onPress={() => {
                    Speech.stop();
                    router.back();
                  }}
                  style={styles.navBtn}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.langBtn}
                  onPress={() => setLang((l) => (l === "en" ? "ur" : "en"))}
                >
                  <Text style={styles.langText}>
                    {lang === "en" ? "اردو" : "EN"}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Content */}
              <View style={styles.textCenterContainer}>
                <View style={styles.textBackground}>
                  <Text style={styles.storyText}>
                    {lang === "en" ? item.paragraph_en : item.paragraph_ur}
                  </Text>
                </View>
              </View>

              <View style={styles.bottomBar}>
                <ParagraphCard
                  text={lang === "en" ? item.paragraph_en : item.paragraph_ur}
                  index={index}
                  isUrdu={lang === "ur"}
                  activeAudioIndex={activeAudioIndex}
                  setActiveAudioIndex={setActiveAudioIndex}
                />
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullScreenImg: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  navBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  langBtn: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 55,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  langText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  textCenterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  textBackground: {
    padding: 15,
    width: "100%",
  },
  storyText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    width: "40%",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingVertical: 0,
    paddingHorizontal: 5,
    borderRadius: 20,
    zIndex: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});
