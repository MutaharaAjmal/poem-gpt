import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface HomeHeaderProps {
  avatar: string | null;
}

export const HomeHeader = ({ avatar }: HomeHeaderProps) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.heading}>Where Stories{"\n"}Made By You</Text>
      </View>
      <View style={styles.headerIcons}>
        {/* <TouchableOpacity style={styles.iconBtn} onPress={toggleMusic}>
                <Ionicons
                  name={isMuted ? "volume-mute" : "volume-high"}
                  size={22}
                  color={isMuted ? "#EF4444" : "#10B981"}
                />
              </TouchableOpacity> */}
        <Image
          source={{
            uri: avatar || "https://via.placeholder.com/150",
          }}
          style={styles.profile}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    // marginTop: 20,
  },
  heading: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 42,
    letterSpacing: 0.5,
  },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  // profile: { width: 45, height: 45, borderRadius: 25 },
  profile: {
    width: 55,
    height: 55,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#8B5CF6",
  },
  section: { marginTop: 30, paddingHorizontal: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
