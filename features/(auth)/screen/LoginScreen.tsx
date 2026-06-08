import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/(tabs)");
      }
    };

    checkSession();
  }, []);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error ⚠️", "Please enter both email and password.");
      return;
    }
    setLoading(true);

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data.session) {
          Alert.alert("Success 🎉", "Account created and logged in!");
          router.replace("/(tabs)");
        } else {
          Alert.alert(
            "Check Email 📧",
            "Please check your inbox for the confirmation link!",
          );
        }
      } else {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("Authentication Error ❌", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      "Google Sign-In",
      "Google authentication integration coming soon!",
    );
  };

  const handleGuestLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="sparkles" size={40} color="#fff" />
          </View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? "Create an account to save your AI masterpieces"
              : "Login to unleash your creative mind"}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="Email Address"
            placeholder="yourname@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <CustomButton
            title={isSignUp ? "Sign Up 🎉" : "Login 🏃‍♂️"}
            loading={loading}
            onPress={handleAuth}
            style={{ marginTop: 15 }}
          />
          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.toggleContainer}
          >
            <Text style={styles.toggleText}>
              {isSignUp
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
          >
            <Ionicons
              name="logo-google"
              size={20}
              color="#DB4437"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestLogin}
          >
            <Text style={styles.guestButtonText}>Explore as a Guest 🕵️‍♂️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFE" },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  toggleContainer: { marginTop: 16, alignItems: "center" },
  toggleText: { fontSize: 13, color: "#8B5CF6", fontWeight: "600" },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#1F2937", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  formContainer: { width: "100%" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  line: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  socialContainer: { width: "100%", alignItems: "center" },
  googleButton: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  googleButtonText: { color: "#374151", fontSize: 15, fontWeight: "700" },
  guestButton: { paddingVertical: 10 },
  guestButtonText: { color: "#8B5CF6", fontSize: 14, fontWeight: "700" },
});
