import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomChipSelectorProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function CustomChipSelector({
  label,
  options,
  selectedValue,
  onSelect,
}: CustomChipSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.chip, isSelected && styles.selectedChip]}
              onPress={() => onSelect(option)}
            >
              <Text
                style={[styles.chipText, isSelected && styles.selectedChipText]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: { fontSize: 14, fontWeight: "700", color: "#4B5563", marginBottom: 8 },
  scrollContainer: { paddingRight: 10 },
  chip: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 25, // Soft pills style
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: "#8B5CF6", // Bright Purple background on select
    borderColor: "#8B5CF6",
  },
  chipText: { color: "#6B7280", fontSize: 14, fontWeight: "500" },
  selectedChipText: { color: "#FFF", fontWeight: "700" },
});
