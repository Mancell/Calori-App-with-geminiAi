import AsyncStorage from "@react-native-async-storage/async-storage";
import { CalorieHistory } from "../types";

const STORAGE_KEY = "calorie_history";

/**
 * Save a new calorie entry to history
 */
export async function saveCalorieEntry(entry: CalorieHistory): Promise<void> {
  try {
    // Get existing history
    const history = await getCalorieHistory();

    // Add new entry to the beginning of the array
    const updatedHistory = [entry, ...history];

    // Save updated history
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error saving calorie entry:", error);
    throw error;
  }
}

/**
 * Get all calorie history entries
 */
export async function getCalorieHistory(): Promise<CalorieHistory[]> {
  try {
    const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (!historyJson) return [];
    return JSON.parse(historyJson);
  } catch (error) {
    console.error("Error getting calorie history:", error);
    return [];
  }
}

/**
 * Delete a calorie entry by ID
 */
export async function deleteCalorieEntry(id: string): Promise<void> {
  try {
    const history = await getCalorieHistory();
    const updatedHistory = history.filter((entry) => entry.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error deleting calorie entry:", error);
    throw error;
  }
}

/**
 * Clear all calorie history
 */
export async function clearCalorieHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing calorie history:", error);
    throw error;
  }
}
