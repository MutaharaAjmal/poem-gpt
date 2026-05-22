import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export const StatItem = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={16} color="#B8B8D2" />
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  label: { color: "#B8B8D2", fontSize: 13, marginLeft: 6 },
});
