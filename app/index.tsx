import { supabase } from "@/src/utils/supabase";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkState = async () => {
      try {
        // 1. Onboarding check
        const hasSeenOnboarding =
          await SecureStore.getItemAsync("hasSeenOnboarding");

        if (!hasSeenOnboarding) {
          setInitialRoute("/onboarding");
        } else {
          // 2. Session check
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            setInitialRoute("/(tabs)");
          } else {
            setInitialRoute("/login");
          }
        }
      } catch (e) {
        setInitialRoute("/onboarding");
      } finally {
        setLoading(false);
      }
    };
    checkState();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return initialRoute ? <Redirect href={initialRoute as any} /> : null;
}
