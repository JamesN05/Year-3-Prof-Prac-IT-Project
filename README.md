# TaskMaxxing

TaskMaxxing is an Expo React Native productivity and habit-tracking app focused on daily consistency, streak building, and lightweight social motivation. The app includes Firebase username/password authentication, a GitHub-style completion heatmap, local habit persistence, and a camera-based social posting flow tied to daily habit completion.

## Features

- Username + password authentication powered by Firebase Auth, with user profile data stored in Firestore `users/{uid}` and username lookup data stored in `usernames/{username}`.
- Daily habits and streak-focused home experience with local persistence for habits, streaks, and history using AsyncStorage.
- GitHub-style heatmap that turns green when all daily tasks are completed.
- Camera unlock flow after completing daily habits, allowing the user to capture an image and create a social-style post.
- Weather card on the home screen that shows current conditions and temperature.
- Polished card-based UI with ongoing glassmorphism-inspired styling work.

## Tech stack

- Expo + React Native with file-based routing in the `app` directory.
- Firebase Authentication for account sign-in and Firestore for user records.
- AsyncStorage for local app data such as habits, streaks, and history.
- Expo packages for camera, notifications, gradients, and navigation support.

## Install dependencies

Install the base project dependencies:

```bash
npm install
```

Install Firebase SDK support for Expo:

```bash
npx expo install firebase
```

Install the Expo packages used in the app:

```bash
npx expo install expo-router expo-notifications expo-camera expo-linear-gradient expo-device expo-constants
npx expo install @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens
```

## Getting started

1. Start the project:

   ```bash
   npx expo start
   ```

2. Open the app in one of the available targets:
- a development build,
- an Android emulator,
- an iOS simulator,
- or Expo Go, depending on the feature set you are testing.

## Firebase setup

This app expects Firebase to be configured for authentication and Firestore usage.

Required setup:
- Enable Email/Password sign-in in Firebase Authentication.
- Create a Firestore database.
- Make sure the Firestore rules allow the app to create and access `users/{uid}` and `usernames/{username}` appropriately.

## Project structure

- `app/` – file-based routes and screen structure for the Expo app.
- `components/` – reusable UI such as cards, settings rows, weather card, and social post components.
- `firebase.ts` – Firebase app initialization and exported auth / Firestore instances.
- `utils/usernameToEmail.ts` – helper used to support username-first login on top of Firebase Auth.

## Notes

- Authentication is fully working in the current app using Firebase Auth and Firestore-backed username mapping.
- Habits, streaks, and history are still stored locally rather than in Firestore at this stage.

## The Team 
Tomás Óg Mac Donncha,
Laoi Rafferty,
Sam Ojo,
James Nagle.
