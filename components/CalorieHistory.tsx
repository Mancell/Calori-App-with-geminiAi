import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { CalorieHistory } from "../types";
import {
  getCalorieHistory,
  deleteCalorieEntry,
  clearCalorieHistory,
} from "../services/storageService";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface CalorieHistoryListProps {
  onSelectEntry?: (entry: CalorieHistory) => void;
  refreshTrigger?: number;
}

export default function CalorieHistoryList({
  onSelectEntry,
  refreshTrigger = 0,
}: CalorieHistoryListProps) {
  const [history, setHistory] = useState<CalorieHistory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getCalorieHistory();
      setHistory(data);
    } catch (error) {
      console.error("Error loading history:", error);
      Alert.alert("Error", "Failed to load calorie history");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteCalorieEntry(id);
      setHistory(history.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      Alert.alert("Error", "Failed to delete entry");
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await clearCalorieHistory();
              setHistory([]);
            } catch (error) {
              console.error("Error clearing history:", error);
              Alert.alert("Error", "Failed to clear history");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }: { item: CalorieHistory }) => (
    <TouchableOpacity
      onPress={() => onSelectEntry && onSelectEntry(item)}
      style={styles.historyItem}
    >
      <ThemedView style={styles.historyCard}>
        <View style={styles.historyContent}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
          ) : (
            <View style={styles.placeholderThumbnail}>
              <FontAwesome name="image" size={24} color="#aaa" />
            </View>
          )}

          <View style={styles.historyDetails}>
            <ThemedText style={styles.historyDate}>
              {formatDate(item.date)}
            </ThemedText>
            <View style={styles.calorieContainer}>
              <FontAwesome name="fire" size={16} color="#FF5722" />
              <ThemedText style={styles.calorieText}>
                {item.totalCalories} calories
              </ThemedText>
            </View>
            <ThemedText style={styles.itemCount}>
              {item.items.length} {item.items.length === 1 ? "item" : "items"}
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteEntry(item.id)}
        >
          <FontAwesome name="trash" size={18} color="#FF5722" />
        </TouchableOpacity>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Calorie History</ThemedText>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <FontAwesome name="trash" size={18} color="#FF5722" />
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <FontAwesome name="history" size={50} color="#aaa" />
          <ThemedText style={styles.emptyText}>No history yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Take photos of your food to track calories
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={loadHistory}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 16,
  },
  historyItem: {
    marginBottom: 12,
  },
  historyCard: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyDetails: {
    flex: 1,
  },
  historyDate: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  calorieContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  calorieText: {
    marginLeft: 4,
    fontWeight: "bold",
  },
  itemCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptySubtext: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
  },
});
