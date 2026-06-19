import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CreatorSectionProps {
  loading: boolean;
  data: any[];
  onPress: (id: string) => void;
}

export const CreatorSection = ({
  loading,
  data,
  onPress,
}: CreatorSectionProps) => {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>Top Creators</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>
      {loading ? (
        <ActivityIndicator
          size="small"
          color="#8B5CF6"
          style={{
            marginVertical: 20,
            // alignSelf: "flex-start",
            marginLeft: 20,
          }}
        />
      ) : (
        <FlatList
          horizontal
          data={data}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.creatorCard}
              onPress={() => router.push(`/creator/${item.id}`)}
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.creatorImage}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
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
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "600" },
  viewAll: { color: "#B8B8D2", fontSize: 13 },
  creatorCard: { marginRight: 15 },
  creatorImage: {
    width: 65,
    height: 65,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#8B5CF6",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  storyCard: {
    width: "48%",
    height: 240,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#222",
    elevation: 10,
  },
  storyImage: { width: "100%", height: "100%", transform: [{ scale: 1.05 }] },
  glowCircle: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 200,
    backgroundColor: "#9333EA",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
    justifyContent: "flex-end",
    height: "50%",
  },
  storyTitle: { color: "#fff", fontSize: 16, fontWeight: "700" },
  storyAuthor: { color: "#ddd", fontSize: 12, marginTop: 5 },

  starIcon: {
    position: "absolute",
    zIndex: 0,
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  creatorName: {
    color: "#fff",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "700",
  },
  storyName: {
    color: "#B8B8D2",
    fontSize: 10,
    marginTop: 2,
  },

  musicPill: {
    position: "absolute",
    bottom: 6,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(20,10,50,0.80)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.5)",
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 18,
    zIndex: 999,
  },
  musicPlayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },
  musicPillTitle: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  musicPillSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 10,
    marginTop: 1,
  },
  musicDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
