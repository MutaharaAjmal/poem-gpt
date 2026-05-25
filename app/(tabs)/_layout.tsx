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

// import { View } from "@/components/Themed";
// import { Ionicons } from "@expo/vector-icons";
// import { Tabs } from "expo-router";
// import React from "react";
// import { Platform, StyleSheet } from "react-native";

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: "#8B5CF6",
//         tabBarInactiveTintColor: "#9CA3AF",
//         headerStyle: {
//           backgroundColor: "#8B5CF6",
//         },
//         headerTintColor: "#fff",
//         headerTitleStyle: {
//           fontWeight: "bold",
//         },

//         tabBarShowLabel: false,
//         sceneStyle: {
//           backgroundColor: "transparent",
//         },
//         // ── FIXED CENTERED CAPSULE ─────────────────────────────────────
//         tabBarStyle: {
//           position: "absolute",
//           bottom: Platform.OS === "ios" ? 28 : 55,
//           width: 260, // Width bilkul aapke mutabiq lock hai

//           // FIXED: Is math se capsule screen ke bilkul center mein aa jayega
//           // left: "50%",
//           marginLeft: 50, // Total width (260) ka exact aadha negative margin

//           backgroundColor: "rgba(255, 255, 255, 0.85)",
//           borderRadius: 25,
//           height: 44,
//           paddingTop: 0,
//           paddingBottom: 0,
//           borderWidth: 1,
//           borderColor: "rgba(255, 255, 255, 0.4)",
//           elevation: 6,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.12,
//           shadowRadius: 8,
//         },
//         tabBarBackground: () => (
//           <View style={{ flex: 1, backgroundColor: "transparent" }} />
//         ),
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Poem GPT",
//           headerShown: false,
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? "home" : "home-outline"}
//               size={22}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="reader"
//         options={{
//           title: "Audio Reader",
//           headerShown: false,
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? "volume-high" : "volume-medium-outline"}
//               size={22}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="create"
//         options={{
//           title: "Create Poem",
//           headerShown: false,
//           tabBarIcon: ({ focused }) => (
//             <View
//               style={[
//                 styles.prominentButton,
//                 focused && styles.prominentButtonActive,
//               ]}
//             >
//               <Ionicons name="add" size={24} color="#fff" />
//             </View>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="history"
//         options={{
//           title: "History",
//           headerShown: false,
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? "time" : "time-outline"}
//               size={22}
//               color={color}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: "Settings",
//           headerShown: false,
//           tabBarIcon: ({ color, focused }) => (
//             <Ionicons
//               name={focused ? "settings" : "settings-outline"}
//               size={22}
//               color={color}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   prominentButton: {
//     width: 38,
//     height: 40,
//     borderRadius: 19,
//     backgroundColor: "#8B5CF6",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: Platform.OS === "ios" ? 0 : -2,
//     shadowColor: "#8B5CF6",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   prominentButtonActive: {
//     backgroundColor: "#8B5CF6",
//     shadowColor: "#8B5CF6",
//   },
// });
