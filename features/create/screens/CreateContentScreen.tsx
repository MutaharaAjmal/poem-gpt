import AppHeader from "@/components/ui/AppHeader";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { supabase } from "@/src/utils/supabase";
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

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

export default function CreateContentScreen() {
  const router = useRouter();
  const [contentType, setContentType] = useState<"story" | "poem">("story");
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [screenStage, setScreenStage] = useState<
    "form" | "generating" | "result"
  >("form");
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const generateAIContent = async () => {
    const isPoem = contentType === "poem";

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a children's ${isPoem ? "poem" : "story"}. Title: "${title}". Idea: "${prompt}". Rules: Provide exactly 4 ${isPoem ? "stanzas" : "paragraphs"}. Separate each with a pipe | symbol.`,
                },
              ],
            },
          ],
        }),
      });

      const json = await response.json();
      console.log("API Response JSON:", JSON.stringify(json, null, 2));
      if (json.error) {
        throw new Error(json.error.message || "Unknown API Error");
      }

      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error("No text found in response");

      return rawText.split("|").filter((p: string) => p.trim().length > 5);
    } catch (error) {
      console.error("DEBUG ERROR:", error);
      throw error;
    }
  };

  const handleCreate = async () => {
    if (!title || !prompt) return Alert.alert("Error", "Fill all fields!");
    setScreenStage("generating");
    try {
      const content = await generateAIContent();
      const tableName = contentType === "story" ? "mystories" : "mypoems";
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from(tableName).insert([
        {
          title,
          prompt,
          user_id: user?.id,
          [contentType === "story" ? "paragraphs" : "stanzas"]: content,
          image_url:
            "https://img.freepik.com/free-vector/boy-reading-open-magical-tale-book_107791-32075.jpg",
        },
      ]);

      if (error) throw error;
      setGeneratedContent(content);
      setScreenStage("result");
    } catch (e: any) {
      setScreenStage("form");
      Alert.alert("Error", e.message || "Failed to generate");
    }
  };

  if (screenStage === "generating") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ color: "#fff", marginTop: 20, fontSize: 16 }}>
          Crafting your {contentType}...
        </Text>
      </View>
    );
  }

  if (screenStage === "result") {
    return (
      <ScreenWrapper>
        <AppHeader title="Generation Result" />
        <ScrollView style={styles.resultScroll}>
          <Text style={styles.resultTitle}>{title}</Text>
          {generatedContent.map((p, i) => (
            <Text key={i} style={styles.paragraph}>
              {p}
            </Text>
          ))}
          <TouchableOpacity
            style={styles.mainBtn}
            onPress={() => setScreenStage("form")}
          >
            <Text style={styles.btnText}>Create Another 🪄</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <AppHeader title="Create Content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              contentType === "story" && styles.activeStory,
            ]}
            onPress={() => setContentType("story")}
          >
            <Text style={styles.btnText}>📖 Story</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              contentType === "poem" && styles.activePoem,
            ]}
            onPress={() => setContentType("poem")}
          >
            <Text style={styles.btnText}>✍️ Poem</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Give your masterpiece a name..."
          placeholderTextColor="#64748B"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Prompt / Idea</Text>
        <TextInput
          style={[styles.input, { height: 120 }]}
          placeholder="Once upon a time..."
          placeholderTextColor="#64748B"
          multiline
          value={prompt}
          onChangeText={setPrompt}
        />

        <TouchableOpacity style={styles.mainBtn} onPress={handleCreate}>
          <LinearGradient
            colors={
              contentType === "story"
                ? ["#EC4899", "#8B5CF6"]
                : ["#3B82F6", "#06B6D4"]
            }
            style={styles.gradient}
          >
            <Text style={styles.btnText}>
              Generate {contentType === "story" ? "Story" : "Poem"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20 },
  resultScroll: { padding: 20 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 6,
    marginBottom: 25,
  },
  toggleBtn: { flex: 1, padding: 15, alignItems: "center", borderRadius: 12 },
  activeStory: { backgroundColor: "#EC4899" },
  activePoem: { backgroundColor: "#06B6D4" },
  label: {
    color: "#94A3B8",
    marginBottom: 8,
    marginLeft: 5,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1E293B",
    padding: 18,
    borderRadius: 16,
    color: "#FFF",
    fontSize: 16,
    marginBottom: 20,
  },
  mainBtn: {
    height: 60,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
    backgroundColor: "#8B5CF6",
  },
  gradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  resultTitle: {
    fontSize: 32,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  paragraph: {
    color: "#E2E8F0",
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 15,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
