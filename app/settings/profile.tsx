import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";

interface AvatarItem {
  url: string;
}

export default function ProfileSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [avatarList, setAvatarList] = useState<AvatarItem[]>([]);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    avatar_url: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchAvatarsFromDb();
  }, []);

  const fetchAvatarsFromDb = async () => {
    const { data } = await supabase.from("avatars").select("url");
    if (data) setAvatarList(data);
  };

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("username, email, avatar_url")
      .eq("id", user.id)
      .single();
    if (data)
      setProfile({
        username: data.username || "",
        email: data.email || user.email || "",
        avatar_url: data.avatar_url || "",
      });
    setLoading(false);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: profile.username,
      avatar_url: profile.avatar_url,
    });
    setIsSaving(false);
    error
      ? Toast.show({ type: "error", text1: "Error", text2: error.message })
      : router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={["#0F1021", "#1A1B3A", "#2A1458"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <View style={styles.avatarContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.avatarWrapper}
          >
            {loading ? (
              <ActivityIndicator color="#8B5CF6" />
            ) : (
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.avatar}
              />
            )}
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={12} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={profile.username}
            onChangeText={(text) =>
              setProfile((p) => ({ ...p, username: text }))
            }
            placeholderTextColor="#666"
          />
          <Text style={styles.label}>Email</Text>
          <Text style={styles.emailValue}>{profile.email}</Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={styles.modal}
          swipeDirection="down"
          onSwipeComplete={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Avatar</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={avatarList}
              numColumns={3}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.avatarItem}
                  onPress={() => {
                    setProfile((p) => ({ ...p, avatar_url: item.url }));
                    setModalVisible(false);
                  }}
                >
                  <Image
                    source={{ uri: item.url }}
                    style={styles.modalAvatar}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    marginLeft: 20,
  },
  avatarContainer: { alignItems: "center", marginBottom: 30 },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#8B5CF6",
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
  editBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#8B5CF6",
    padding: 6,
    borderRadius: 20,
  },
  form: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 20,
  },
  label: { color: "#94A3B8", marginBottom: 8 },
  input: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 20,
  },
  emailValue: { color: "#64748B", fontSize: 16, marginBottom: 20 },
  saveBtn: {
    backgroundColor: "#8B5CF6",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnText: { color: "#fff", fontWeight: "800" },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalContent: {
    backgroundColor: "#0F1021",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "50%",
    paddingTop: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#334155",
    alignSelf: "center",
    borderRadius: 2,
    marginBottom: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  avatarItem: { flex: 1 / 3, alignItems: "center", marginBottom: 15 },
  modalAvatar: {
    width: 85,
    height: 85,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: "#1E293B",
  },
});
