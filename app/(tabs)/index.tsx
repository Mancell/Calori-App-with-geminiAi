import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { FontAwesome } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FoodImageAnalyzer from "@/components/FoodImageAnalyzer";
import FoodAnalysisResult from "@/components/FoodAnalysisResult";
import CalorieHistoryList from "@/components/CalorieHistory";
import { FoodAnalysis, CalorieHistory } from "@/types";
import { saveCalorieEntry } from "@/services/storageService";

export default function HomeScreen() {
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CalorieHistory | null>(
    null
  );

  const handleAnalysisComplete = (result: FoodAnalysis) => {
    setAnalysis(result);
  };

  const handleSaveAnalysis = async () => {
    if (!analysis) return;

    try {
      // Create a history entry
      const historyEntry: CalorieHistory = {
        id: uuidv4(),
        date: analysis.date,
        totalCalories: analysis.totalCalories,
        items: analysis.items,
        imageUri: analysis.imageUri,
      };

      // Save to storage
      await saveCalorieEntry(historyEntry);

      // Reset analysis and trigger refresh of history
      setAnalysis(null);
      setRefreshTrigger((prev) => prev + 1);

      Alert.alert("Success", "Food analysis saved to history");
    } catch (error) {
      console.error("Error saving analysis:", error);
      Alert.alert("Error", "Failed to save analysis");
    }
  };

  const handleSelectEntry = (entry: CalorieHistory) => {
    setSelectedEntry(entry);
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
  };

  // Convert CalorieHistory to FoodAnalysis format for the result component
  const convertToAnalysis = (entry: CalorieHistory): FoodAnalysis => {
    return {
      items: entry.items,
      totalCalories: entry.totalCalories,
      date: entry.date,
      imageUri: entry.imageUri,
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        {!showHistory ? (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.spacer} />

            <View style={styles.headerContainer}>
              <View style={styles.headerBackground}>
                <FontAwesome
                  name="cutlery"
                  size={24}
                  color="#fff"
                  style={styles.headerIcon}
                />
                <ThemedText style={styles.title}>Calories Tracker</ThemedText>
              </View>
              <ThemedText style={styles.subtitle}>
                Take a photo of your food to analyze calories
              </ThemedText>
            </View>

            <FoodImageAnalyzer onAnalysisComplete={handleAnalysisComplete} />

            {analysis && (
              <View style={styles.resultContainer}>
                <FoodAnalysisResult analysis={analysis} />

                <ThemedView style={styles.saveButtonContainer}>
                  <ThemedText
                    style={styles.saveButton}
                    onPress={handleSaveAnalysis}
                  >
                    Save to History
                  </ThemedText>
                </ThemedView>
              </View>
            )}

            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => setShowHistory(true)}
            >
              <FontAwesome name="history" size={20} color="#fff" />
              <ThemedText style={styles.historyButtonText}>
                View History
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <View style={styles.historyContainer}>
            <View style={styles.historyHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowHistory(false)}
              >
                <FontAwesome name="arrow-left" size={24} color="#fff" />
                <ThemedText style={styles.backButtonText}>Back</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.historyTitle}>
                Calorie History
              </ThemedText>
              <View style={{ width: 80 }} />
            </View>

            <CalorieHistoryList
              onSelectEntry={handleSelectEntry}
              refreshTrigger={refreshTrigger}
            />

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => setShowHistory(false)}
            >
              <FontAwesome name="home" size={20} color="#fff" />
              <ThemedText style={styles.homeButtonText}>
                Back to Home
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={!!selectedEntry}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <FontAwesome name="close" size={24} color="#FF5722" />
              </TouchableOpacity>

              {selectedEntry && (
                <FoodAnalysisResult
                  analysis={convertToAnalysis(selectedEntry)}
                />
              )}
            </ThemedView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  contentContainer: {
    padding: 16,
  },
  spacer: {
    height: 40,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  headerBackground: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    color: "#fff",
  },
  resultContainer: {
    marginTop: 16,
  },
  saveButtonContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#111",
  },
  saveButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    padding: 12,
  },
  historyButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  historyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  historyContainer: {
    flex: 1,
    paddingBottom: 16,
    backgroundColor: "#000",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#4CAF50",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  homeButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  homeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxHeight: "90%",
    borderRadius: 12,
    padding: 16,
    position: "relative",
    backgroundColor: "#111",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
  },
});
