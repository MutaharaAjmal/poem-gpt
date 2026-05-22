import { View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8B5CF6",
        tabBarInactiveTintColor: "#9CA3AF",
        headerStyle: {
          backgroundColor: "#8B5CF6",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "400",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Poem GPT",
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reader"
        options={{
          title: "Audio Reader",
          headerShown: false,
          tabBarLabel: "Read Aloud",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "volume-high" : "volume-medium-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="create"
        options={{
          title: "Create Poem",
          tabBarLabel: "Create",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add" : "add-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="create"
        options={{
          title: "Create Poem",
          tabBarLabel: "Create",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.prominentButton,
                focused && styles.prominentButtonActive,
              ]}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarLabel: "History",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  prominentButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B5CF6", // Default active color
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  prominentButtonActive: {
    backgroundColor: "#8B5CF6", // Jab active hoga toh aapka pasandida color show hoga
    shadowColor: "#8B5CF6",
  },
});
