import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { analyzeFoodImage } from "../services/geminiService";
import { FoodAnalysis, FoodItem } from "../types";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface FoodImageAnalyzerProps {
  onAnalysisComplete: (analysis: FoodAnalysis) => void;
}

export default function FoodImageAnalyzer({
  onAnalysisComplete,
}: FoodImageAnalyzerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to use this feature"
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
        if (result.assets[0].base64) {
          analyzeImage(result.assets[0].base64, result.assets[0].uri);
        } else {
          Alert.alert("Error", "Could not get image data");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera permissions to use this feature"
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImage(result.assets[0].uri);
        if (result.assets[0].base64) {
          analyzeImage(result.assets[0].base64, result.assets[0].uri);
        } else {
          Alert.alert("Error", "Could not get image data");
        }
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const analyzeImage = async (base64: string, uri: string) => {
    try {
      setLoading(true);
      console.log("Starting image analysis...");

      // Call Gemini API to analyze the image
      const analysisResult = await analyzeFoodImage(base64);
      console.log("Analysis result:", analysisResult);

      // Format the result
      let foodItems: FoodItem[] = [];
      let totalCalories = 0;

      if (analysisResult.items && Array.isArray(analysisResult.items)) {
        foodItems = analysisResult.items.map((item: any) => ({
          name: item.name || "Unknown Food",
          calories: item.calories || 0,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          unit: item.unit,
          quantity: item.quantity,
        }));
      } else {
        console.warn("No items array in analysis result");
      }

      if (analysisResult.totalCalories) {
        totalCalories = analysisResult.totalCalories;
      } else if (foodItems.length > 0) {
        totalCalories = foodItems.reduce(
          (sum: number, item: FoodItem) => sum + (item.calories || 0),
          0
        );
      }

      console.log("Processed food items:", foodItems);
      console.log("Total calories:", totalCalories);

      // Create analysis object
      const analysis: FoodAnalysis = {
        items: foodItems,
        totalCalories,
        date: new Date().toISOString(),
        imageUri: uri,
      };

      // Pass the analysis to the parent component
      onAnalysisComplete(analysis);
    } catch (error) {
      console.error("Error analyzing image:", error);
      Alert.alert(
        "Analysis Error",
        "Failed to analyze the food image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <ThemedText style={styles.loadingText}>
                Analyzing your food...
              </ThemedText>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <FontAwesome name="camera" size={50} color="#aaa" />
          <ThemedText style={styles.placeholderText}>
            Take a photo of your food
          </ThemedText>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          onPress={takePhoto}
          disabled={loading}
        >
          <FontAwesome name="camera" size={20} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.galleryButton]}
          onPress={pickImage}
          disabled={loading}
        >
          <FontAwesome name="image" size={20} color="#fff" />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#aaa",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  cameraButton: {
    backgroundColor: "#4CAF50",
  },
  galleryButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
});
