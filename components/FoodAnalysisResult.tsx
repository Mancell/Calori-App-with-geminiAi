import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FoodAnalysis, FoodItem } from "../types";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface FoodAnalysisResultProps {
  analysis: FoodAnalysis;
}

export default function FoodAnalysisResult({
  analysis,
}: FoodAnalysisResultProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Food Analysis Results</ThemedText>

      {analysis.imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: analysis.imageUri }} style={styles.image} />
        </View>
      )}

      <View style={styles.totalContainer}>
        <FontAwesome name="fire" size={24} color="#FF5722" />
        <ThemedText style={styles.totalCalories}>
          {analysis.totalCalories} calories
        </ThemedText>
      </View>

      <ThemedText style={styles.dateText}>
        {formatDate(analysis.date)}
      </ThemedText>

      <ThemedText style={styles.sectionTitle}>Food Items</ThemedText>

      <ScrollView style={styles.itemsContainer}>
        {analysis.items.map((item, index) => (
          <FoodItemCard key={index} item={item} />
        ))}

        {analysis.items.length === 0 && (
          <ThemedText style={styles.emptyText}>
            No food items detected
          </ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

interface FoodItemCardProps {
  item: FoodItem;
}

function FoodItemCard({ item }: FoodItemCardProps) {
  return (
    <ThemedView style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
        <ThemedText style={styles.itemCalories}>{item.calories} cal</ThemedText>
      </View>

      {(item.protein !== undefined ||
        item.carbs !== undefined ||
        item.fat !== undefined) && (
        <View style={styles.macrosContainer}>
          {item.protein !== undefined && (
            <View style={styles.macroItem}>
              <ThemedText style={styles.macroLabel}>Protein</ThemedText>
              <ThemedText style={styles.macroValue}>{item.protein}g</ThemedText>
            </View>
          )}

          {item.carbs !== undefined && (
            <View style={styles.macroItem}>
              <ThemedText style={styles.macroLabel}>Carbs</ThemedText>
              <ThemedText style={styles.macroValue}>{item.carbs}g</ThemedText>
            </View>
          )}

          {item.fat !== undefined && (
            <View style={styles.macroItem}>
              <ThemedText style={styles.macroLabel}>Fat</ThemedText>
              <ThemedText style={styles.macroValue}>{item.fat}g</ThemedText>
            </View>
          )}
        </View>
      )}

      {item.quantity && item.unit && (
        <ThemedText style={styles.quantityText}>
          {item.quantity} {item.unit}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  totalCalories: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 8,
  },
  dateText: {
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  itemsContainer: {
    maxHeight: 300,
  },
  itemCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemCalories: {
    fontWeight: "bold",
  },
  macrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  macroItem: {
    alignItems: "center",
    flex: 1,
  },
  macroLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  macroValue: {
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
    padding: 16,
  },
});
