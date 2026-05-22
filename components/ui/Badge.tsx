import { StyleSheet, Text, View } from "react-native";

export const Badge = ({ label }: { label: string }) => (
  <View style={styles.badge}>
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  text: { color: "#fff", fontSize: 12, fontWeight: "600" },
});
