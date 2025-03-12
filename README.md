# Calories Tracker App

A mobile application that uses Google Gemini Flash 2.0 AI to analyze food images and track calories.

## Features

- **Food Image Analysis**: Take photos of your food or select from gallery
- **AI-Powered Calorie Detection**: Uses Google Gemini Flash 2.0 to analyze food and estimate calories
- **Detailed Nutritional Information**: View calories, protein, carbs, and fat content
- **History Tracking**: Save and view your calorie consumption history
- **Cross-Platform**: Works on iOS, Android, and web

## Technologies Used

- React Native with Expo
- TypeScript
- Google Gemini Flash 2.0 API via OpenRouter
- Expo Router for navigation
- AsyncStorage for local data persistence
- Expo Image Picker for camera and gallery access

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd calories-tracker
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Open the app on your device:
   - Scan the QR code with the Expo Go app on your phone
   - Press 'a' to open on Android emulator
   - Press 'i' to open on iOS simulator
   - Press 'w' to open in web browser

## API Configuration

The app uses Google Gemini Flash 2.0 API through OpenRouter. The API key is already configured in the app, but you can replace it with your own in `services/geminiService.ts`.

## Usage

1. Open the app and navigate to the "Analyze" tab
2. Take a photo of your food or select an image from your gallery
3. Wait for the AI to analyze the image and provide calorie information
4. Save the analysis to your history
5. View your calorie history in the "History" tab

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Google Gemini for providing the AI image analysis capabilities
- OpenRouter for API access
- Expo team for the excellent React Native development platform
