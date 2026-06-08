import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [isKidsMode, setIsKidsMode] = useState(false);
  const router = useRouter();
  const handleAction = (title: string) => {
    Alert.alert(
      "Settings⚙️",
      `${title} feature coming soon in the next update!`,
    );
  };

  const handleLogout = async () => {
    Alert.alert("Sign Out 🚪", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace("/(auth)/login");
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  // Helper component for settings rows
  const SettingRow = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
  }: {
    icon: any;
    title: string;
    subtitle: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.rowItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#8B5CF6" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <Ionicons
          name="chevron-forward"
          size={18}
          color="rgba(255,255,255,0.3)"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.heading}>App Settings</Text>
            <Text style={styles.subheading}>
              Customize your magical AI story experience
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Account Profile</Text>
          <View style={styles.cardContainer}>
            <SettingRow
              icon="person-outline"
              title="Account Details"
              subtitle="Manage your profile and saved data"
              onPress={() => router.push("/settings/profile")}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="sparkles-outline"
              title="Subscription Plan"
              subtitle="Premium Member (Gemini Pro Access)"
              onPress={() => handleAction("Premium Subscription")}
            />
          </View>

          {/* PREFERENCES SECTION */}
          <Text style={styles.sectionLabel}>Preferences</Text>
          <View style={styles.cardContainer}>
            <SettingRow
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Get notified when new stories arrive"
              rightElement={
                <Switch
                  trackColor={{ false: "#3e3e3e", true: "#1E3A8A" }} // Your custom accent color
                  thumbColor={isPushEnabled ? "#3B82F6" : "#f4f3f4"}
                  onValueChange={() => setIsPushEnabled(!isPushEnabled)}
                  value={isPushEnabled}
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="color-filter-outline"
              title="Background Music"
              subtitle="Strictly restrict AI content to PG clean stories"
              rightElement={
                <Switch
                  trackColor={{ false: "#3e3e3e", true: "#1E3A8A" }}
                  thumbColor={isKidsMode ? "#3B82F6" : "#f4f3f4"}
                  onValueChange={() => setIsKidsMode(!isKidsMode)}
                  value={isKidsMode}
                />
              }
            />
          </View>

          {/* SUPPORT & LEGAL */}
          <Text style={styles.sectionLabel}>Support & Info</Text>
          <View style={styles.cardContainer}>
            <SettingRow
              icon="help-circle-outline"
              title="Help Center"
              subtitle="FAQs, tutorials, and customer support"
              onPress={() => handleAction("Help Center")}
            />
            <View style={styles.divider} />
            <SettingRow
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              subtitle="How we keep your creations secure"
              onPress={() => handleAction("Privacy Policy")}
            />
          </View>

          {/* LOGOUT BUTTON */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#F87171"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.logoutText}>Sign Out Account</Text>
          </TouchableOpacity>

          {/* FOOTER INFO */}
          <Text style={styles.versionText}>PoemGPT Engine v2.5.0</Text>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { marginBottom: 30 },
  heading: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  subheading: { color: "#B8B8D2", fontSize: 14, marginTop: 8, lineHeight: 22 },

  sectionLabel: {
    color: "#8B5CF6",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },

  // Translucent Glassmorphic Container List
  cardContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  textContainer: { flex: 1, paddingRight: 10 },
  rowTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  rowSubtitle: { color: "#B8B8D2", fontSize: 12, marginTop: 3, lineHeight: 16 },

  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    width: "100%",
  },

  // Logout Styling
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 18,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
  },
  logoutText: { color: "#F87171", fontSize: 16, fontWeight: "700" },

  versionText: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.2)",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
