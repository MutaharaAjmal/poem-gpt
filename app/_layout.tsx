import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="story/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="creator/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings/profile"
          options={{ headerShown: false }}
        />
      </Stack>
      <Toast />
    </>
  );
}
