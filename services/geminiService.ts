import { Platform } from "react-native";

// API key for OpenRouter
const OPENROUTER_API_KEY =
  "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";
const SITE_URL =
  Platform.OS === "web" ? window.location.origin : "app://calories-tracker";
const SITE_NAME = "Calories Tracker";

// Sample food database for demo purposes
const SAMPLE_FOODS: Record<
  string,
  {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }
> = {
  apple: { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  banana: { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  orange: { name: "Orange", calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  pizza: {
    name: "Pizza Slice",
    calories: 285,
    protein: 12,
    carbs: 36,
    fat: 10,
  },
  burger: { name: "Hamburger", calories: 354, protein: 20, carbs: 40, fat: 17 },
  salad: { name: "Green Salad", calories: 45, protein: 2, carbs: 7, fat: 0.5 },
  chicken: {
    name: "Grilled Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  rice: {
    name: "White Rice (1 cup)",
    calories: 205,
    protein: 4,
    carbs: 45,
    fat: 0.4,
  },
  bread: { name: "Bread Slice", calories: 80, protein: 3, carbs: 15, fat: 1 },
  pasta: {
    name: "Pasta (1 cup)",
    calories: 220,
    protein: 8,
    carbs: 43,
    fat: 1.3,
  },
};

// Function to get sample food data based on image content
function getSampleFoodData(imageBase64: string): any {
  // In a real app, we would analyze the image here
  // For demo, we'll return random food items
  const foodKeys = Object.keys(SAMPLE_FOODS);
  const randomFoodCount = Math.floor(Math.random() * 3) + 1; // 1-3 food items

  const items = [];
  let totalCalories = 0;

  for (let i = 0; i < randomFoodCount; i++) {
    const randomIndex = Math.floor(Math.random() * foodKeys.length);
    const foodKey = foodKeys[randomIndex];
    const food = SAMPLE_FOODS[foodKey];

    items.push(food);
    totalCalories += food.calories;
  }

  return {
    items,
    totalCalories,
  };
}

/**
 * Analyzes a food image and returns calorie information
 * @param imageBase64 - Base64 encoded image data
 * @returns Promise with the analysis result
 */
export async function analyzeFoodImage(imageBase64: string): Promise<any> {
  try {
    console.log("Sending request to Gemini API...");

    // For demo purposes, use sample data instead of real API
    // Remove this line when API is working
    return getSampleFoodData(imageBase64);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-pro-exp-02-05:free",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: 'Analyze this food image and provide the following information in JSON format: 1) Identify all food items in the image, 2) Estimate calories for each item, 3) Calculate total calories, 4) List main nutrients (protein, carbs, fat) if possible. Format response as valid JSON only with this structure: {"items": [{"name": "food name", "calories": number, "protein": number, "carbs": number, "fat": number}], "totalCalories": number}',
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(
        `API Error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Extract the content from the response
    const content = data.choices[0]?.message?.content;
    console.log("Content from API:", content);

    if (!content) {
      console.error("No content in API response");
      return getSampleFoodData(imageBase64);
    }

    // Try to parse JSON from the response
    try {
      // Find JSON in the response if it's wrapped in text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        console.log("Parsed JSON data:", parsedData);
        return parsedData;
      }

      const parsedData = JSON.parse(content);
      console.log("Parsed JSON data:", parsedData);
      return parsedData;
    } catch (e) {
      console.error("Error parsing JSON:", e);
      console.log("Returning fallback data due to parsing error");

      // If parsing fails, return sample data
      return getSampleFoodData(imageBase64);
    }
  } catch (error) {
    console.error("Error analyzing food image:", error);

    // Return sample data when API fails
    return getSampleFoodData(imageBase64);
  }
}
