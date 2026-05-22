import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ResultView from "../../components/ui/ResultView";
const GEMINI_API_KEY = "AIzaSyA9s7GxYJ-R0o04r221kc3nWp0jYTBc4a4";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export default function CreateStoryScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");

  // SELECTION CONFIG STATES
  const [mood, setMood] = useState("Magical 🦄");
  const [length, setLength] = useState(4);
  const [lang, setLang] = useState("English 🇬🇧");
  const [character, setCharacter] = useState("Animal 🦁");

  // NEW STATE: Image Selection Type (Free vs Premium)
  const [imageType, setImageType] = useState<"free" | "premium">("free");

  const [screenStage, setScreenStage] = useState<
    "form" | "generating" | "result"
  >("form");
  const [generatedStoryParagraphs, setGeneratedStoryParagraphs] = useState<
    string[]
  >([]);

  // OPTION DATA FOR CARDS
  const moods = [
    {
      id: "Magical 🦄",
      label: "Magical",
      desc: "Fairies & Magic",
      icon: "sparkles",
      color: "#EC4899",
    },
    {
      id: "Funny 😂",
      label: "Funny",
      desc: "Laugh & Giggle",
      icon: "happy",
      color: "#F59E0B",
    },
    {
      id: "Adventure 🧭",
      label: "Adventure",
      desc: "Explore Worlds",
      icon: "compass",
      color: "#10B981",
    },
    {
      id: "Bedtime 🌙",
      label: "Bedtime",
      desc: "Sweet Dreams",
      icon: "moon",
      color: "#6366F1",
    },
  ];

  const characters = [
    {
      id: "Animal 🦁",
      label: "Animal",
      desc: "Lions, Pups",
      icon: "paw",
      color: "#F97316",
    },
    {
      id: "Cute Kid 👦",
      label: "Super Kid",
      desc: "Boys & Girls",
      icon: "person",
      color: "#06B6D4",
    },
    {
      id: "Robot/Alien 🤖",
      label: "Sci-Fi",
      desc: "Space Buds",
      icon: "planet",
      color: "#8B5CF6",
    },
  ];

  const languages = [
    {
      id: "English 🇬🇧",
      label: "English",
      desc: "Global Tales",
      icon: "language",
      color: "#3B82F6",
    },
    {
      id: "Urdu 🇵🇰",
      label: "اردو",
      desc: "Urdu Script",
      icon: "pencil",
      color: "#10B981",
    },
    {
      id: "Roman Urdu ✍️",
      label: "Roman",
      desc: "Aap Jise Parhein",
      icon: "chatbubbles",
      color: "#EC4899",
    },
    {
      id: "Hindi 🇮🇳",
      label: "हिंदी",
      desc: "Hindi Kahani",
      icon: "heart",
      color: "#EF4444",
    },
  ];

  const lengths = [
    {
      val: 2,
      label: "Short",
      desc: "2 Pages",
      icon: "flash",
      color: "#EF4444",
    },
    {
      val: 4,
      label: "Medium",
      desc: "4 Pages",
      icon: "book",
      color: "#3B82F6",
    },
    {
      val: 6,
      label: "Long",
      desc: "6 Pages",
      icon: "library",
      color: "#8B5CF6",
    },
  ];

  // Handler for Image selection that alerts on Premium mode click
  // Handler for Image selection that alerts on Premium mode click
  const handleImageTypePress = (type: "free" | "premium") => {
    if (type === "premium") {
      Alert.alert(
        "👑 Unlock Premium Mode",
        "Custom AI Generated Illustrations are only available in the Premium Spellbook! Would you like to upgrade to get magical graphics?",
        [
          { text: "Maybe Later 😢", style: "cancel" }, // <-- 'role' ko badal kar 'style' kar diya
          {
            text: "Go Premium 🚀",
            onPress: () => console.log("Navigate to paywall screen"),
          },
        ],
      );
      // Keep it set to free unless they are a paid user
      setImageType("free");
    } else {
      setImageType("free");
    }
  };

  const generateRealAIStory = async () => {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a premium quality story for young children based on the following configurations:
                  Title: "${title}"
                  Idea/Prompt: "${prompt}"
                  Story Category/Mood: "${mood}"
                  Main Character Type: "${character}"
                  Language: "${lang}"
                  
                  CRITICAL FORMATTING RULES:
                  1. You must write exactly ${length} paragraphs. No more, no less.
                  2. Do not write the title, introduction, page numbers, or headers. 
                  3. Only give me the story text, with paragraphs separated by exactly two newlines.
                  4. The entire text must be strictly written in the selected language: "${lang}".`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
        }),
      });

      const json = await response.json();
      if (json.error) throw new Error(json.error.message);

      const generatedText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText)
        throw new Error("Gemini API rejected the configuration.");

      const rawParagraphs = generatedText
        .split("\n")
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 15);

      let finalParagraphs = [];
      if (rawParagraphs.length >= length) {
        finalParagraphs = rawParagraphs.slice(0, length);
      } else {
        finalParagraphs = [...rawParagraphs];
        while (finalParagraphs.length < length) {
          finalParagraphs.push(
            lang.includes("Urdu")
              ? "Aur yun, unki sachhi dosti ki pyari si dastan hamesha zinda rahi."
              : "And so, the magical spark of imagination kept glowing beautifully forever inside their pure hearts.",
          );
        }
      }
      return finalParagraphs;
    } catch (error: any) {
      throw new Error(error.message || "AI Service is temporarily busy.");
    }
  };

  const handleCreateStory = async () => {
    if (!title.trim() || !prompt.trim()) {
      Alert.alert(
        "✨ Uh Oh!",
        "Please give your story a title and a magical prompt first! 🧚‍♂️",
      );
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      Alert.alert(
        "🔒 Login Required",
        "Story bananay ke liye aapka login hona zaroori hai. Kya aap login karna chahte hain?",
        [
          { text: "Go Back", style: "cancel" },
          {
            text: "Login Now",
            onPress: () => router.push("/(auth)/login"), // Aapke login route ka path
          },
        ],
      );
      return;
    }
    try {
      setScreenStage("generating");
      const aiParagraphs = await generateRealAIStory();

      // Set image based on free tier selection
      const defaultAIImage =
        "https://img.freepik.com/free-vector/boy-reading-open-magical-tale-book_107791-32075.jpg";

      const { error } = await supabase.from("mystories").insert([
        {
          title: title,
          prompt: prompt,
          image_url: defaultAIImage,
          tags: [mood, lang, character, "Gemini AI"],
          paragraphs: aiParagraphs,
        },
      ]);

      if (error) throw error;

      setGeneratedStoryParagraphs(aiParagraphs);
      setScreenStage("result");
    } catch (error: any) {
      setScreenStage("form");
      Alert.alert(
        "🔮 Magic Interrupted",
        error.message || "Something went wrong.",
      );
    }
  };

  const resetFormState = () => {
    setTitle("");
    setPrompt("");
    setGeneratedStoryParagraphs([]);
    setScreenStage("form");
    setImageType("free");
  };

  if (screenStage === "generating") {
    return (
      <LinearGradient
        colors={["#1E3A8A", "#3B82F6", "#8B5CF6"]}
        style={styles.centeredScreen}
      >
        <View style={styles.loadingBox}>
          <View style={styles.iconCircleGlow}>
            <Ionicons name="color-wand" size={50} color="#fff" />
          </View>
          <ActivityIndicator
            size="large"
            color="#FFD700"
            style={{ marginTop: 30 }}
          />
          <Text style={styles.generatingTitle}>Mixing Magic Spells... ✨</Text>
          <Text style={styles.generatingSub}>
            Creating a beautiful {mood.toLowerCase()} story in {lang} containing
            exactly {length} pages!
          </Text>
        </View>
      </LinearGradient>
    );
  }

  if (screenStage === "result") {
    return (
      <ResultView
        title={title}
        generatedStoryParagraphs={generatedStoryParagraphs}
        resetFormState={resetFormState}
      />
    );
  }

  return (
    <LinearGradient colors={["#1E3A8A", "#0F172A"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.heading}>Story Factory 🦄</Text>
            <Text style={styles.subheading}>
              Tap the big colorful magic cards to design your custom fairytale
              world!
            </Text>
          </View>

          {/* INPUT 1: TITLE */}
          <Text style={styles.sectionLabel}>🌟 Name Your Story</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="book"
              size={22}
              color="#F472B6"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g., Tiger's Secret Spaceship 🐯"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* CATEGORY SELECTOR (MOOD) */}
          <Text style={styles.sectionLabel}>🎭 Select Story Vibe</Text>
          <View style={styles.gridRow}>
            {moods.map((m) => {
              const isActive = mood === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.bigCard,
                    isActive && {
                      borderColor: m.color,
                      backgroundColor: "rgba(255,255,255,0.12)",
                    },
                  ]}
                  onPress={() => setMood(m.id)}
                >
                  <View style={[styles.iconBox, { backgroundColor: m.color }]}>
                    <Ionicons name={m.icon as any} size={22} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>{m.label}</Text>
                  <Text style={styles.cardDesc}>{m.desc}</Text>
                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={m.color}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CHARACTER SELECTOR */}
          <Text style={styles.sectionLabel}>🦖 Choose Your Main Hero</Text>
          <View style={styles.gridRow}>
            {characters.map((c) => {
              const isActive = character === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.threeColumnCard,
                    isActive && {
                      borderColor: c.color,
                      backgroundColor: "rgba(255,255,255,0.12)",
                    },
                  ]}
                  onPress={() => setCharacter(c.id)}
                >
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: c.color,
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                      },
                    ]}
                  >
                    <Ionicons name={c.icon as any} size={18} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {c.label}
                  </Text>
                  <Text style={styles.cardDesc} numberOfLines={1}>
                    {c.desc}
                  </Text>
                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={c.color}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* LANGUAGE SELECTOR */}
          <Text style={styles.sectionLabel}>🗣️ Story Language</Text>
          <View style={styles.gridRow}>
            {languages.map((l) => {
              const isActive = lang === l.id;
              return (
                <TouchableOpacity
                  key={l.id}
                  style={[
                    styles.bigCard,
                    isActive && {
                      borderColor: l.color,
                      backgroundColor: "rgba(255,255,255,0.12)",
                    },
                  ]}
                  onPress={() => setLang(l.id)}
                >
                  <View style={[styles.iconBox, { backgroundColor: l.color }]}>
                    <Ionicons name={l.icon as any} size={22} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle}>{l.label}</Text>
                  <Text style={styles.cardDesc}>{l.desc}</Text>
                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={l.color}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* LENGTH SELECTOR */}
          <Text style={styles.sectionLabel}>📏 Book Length</Text>
          <View style={styles.gridRow}>
            {lengths.map((len) => {
              const isActive = length === len.val;
              return (
                <TouchableOpacity
                  key={len.val}
                  style={[
                    styles.threeColumnCard,
                    isActive && {
                      borderColor: len.color,
                      backgroundColor: "rgba(255,255,255,0.12)",
                    },
                  ]}
                  onPress={() => setLength(len.val)}
                >
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: len.color,
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                      },
                    ]}
                  >
                    <Ionicons name={len.icon as any} size={18} color="#fff" />
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {len.label}
                  </Text>
                  <Text style={styles.cardDesc} numberOfLines={1}>
                    {len.desc}
                  </Text>
                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={len.color}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* NEW SECTION: IMAGE TYPE SELECTION (FREE vs PREMIUM) */}
          <Text style={styles.sectionLabel}>🖼️ Story Illustration Mode</Text>
          <View style={styles.gridRow}>
            {/* Free Option Card */}
            <TouchableOpacity
              style={[
                styles.bigCard,
                imageType === "free" && {
                  borderColor: "#10B981",
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
              ]}
              onPress={() => handleImageTypePress("free")}
            >
              <View style={[styles.iconBox, { backgroundColor: "#10B981" }]}>
                <Ionicons name="image" size={22} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Standard Book</Text>
              <Text style={styles.cardDesc}>Free Dummy Cover</Text>
              {imageType === "free" && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#10B981"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>

            {/* Premium Option Card with Crown */}
            <TouchableOpacity
              style={[
                styles.bigCard,
                imageType === "premium" && {
                  borderColor: "#F59E0B",
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
              ]}
              onPress={() => handleImageTypePress("premium")}
            >
              <View style={[styles.iconBox, { backgroundColor: "#F59E0B" }]}>
                <Ionicons name="star" size={22} color="#fff" />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.cardTitle}>AI Magic Illustration</Text>
              </View>
              <Text
                style={[
                  styles.cardDesc,
                  { color: "#FBBF24", fontWeight: "700" },
                ]}
              >
                👑 Premium Mode Only
              </Text>
            </TouchableOpacity>
          </View>

          {/* INPUT 5: PROMPT */}
          <Text style={styles.sectionLabel}>
            🔮 What happens next? (Your Twist)
          </Text>
          <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
            <Ionicons
              name="sparkles"
              size={22}
              color="#8B5CF6"
              style={[styles.inputIcon, { marginTop: 14 }]}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., They find a talking tree that gives them secret chocolate powers!"
              placeholderTextColor="rgba(255,255,255,0.35)"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={prompt}
              onChangeText={setPrompt}
            />
          </View>

          {/* ULTRA PREMIUM CAST BUTTON */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleCreateStory}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#EC4899", "#8B5CF6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBtn}
            >
              <View style={styles.btnContent}>
                <Ionicons
                  name="color-wand"
                  size={24}
                  color="#fff"
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.btnText}>Cast Story Spell 🪄</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingHorizontal: 16, paddingTop: 15, paddingBottom: 40 },
  header: { marginBottom: 25, alignItems: "center" },
  heading: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(139, 92, 246, 0.4)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  subheading: {
    color: "#93C5FD",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 10,
    lineHeight: 20,
  },

  sectionLabel: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 10,
    letterSpacing: 0.3,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  textAreaWrapper: { alignItems: "flex-start" },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 14,
  },
  textArea: { height: 90, paddingTop: 14 },

  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 10,
  },

  bigCard: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 22,
    padding: 14,
    alignItems: "flex-start",
    position: "relative",
  },

  threeColumnCard: {
    width: "31.3%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.06)",
    padding: 10,
    borderRadius: 18,
    alignItems: "flex-start",
    position: "relative",
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: { color: "#FFF", fontSize: 14, fontWeight: "800", marginTop: 2 },
  cardDesc: { color: "#94A3B8", fontSize: 11, marginTop: 2, fontWeight: "500" },
  checkIcon: { position: "absolute", top: 12, right: 12 },

  buttonContainer: {
    width: "100%",
    height: 60,
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 10,
    shadowColor: "#EC4899",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientBtn: { flex: 1, justifyContent: "center", alignItems: "center" },
  btnContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  centeredScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  loadingBox: { alignItems: "center", width: "100%" },
  iconCircleGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  generatingTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 25,
  },
  generatingSub: {
    color: "#E0F2FE",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});
