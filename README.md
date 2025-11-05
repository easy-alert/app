# Easy Alert App

A React Native application for managing maintenance activities, built with Expo and TypeScript.

## 🚀 Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/easy-alert/app.git
   cd app
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Install Expo CLI (if not already installed):**
   ```sh
   npm install -g expo-cli
   ```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables (adjust values as needed):

```
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

## ▶️ Running the App

To start the app in development mode:

```sh
npx expo start
```

Follow the instructions in the terminal to run on an emulator or a physical device.

## 🧩 Reactotron Debugging

This project is configured to use [Reactotron](https://github.com/infinitered/reactotron) for debugging in development mode.

### How to use Reactotron:

1. **Install Reactotron Desktop App:**

   - Download from [https://infinite.red/reactotron](https://infinite.red/reactotron)

2. **Start Reactotron before running the app.**

3. **Run the app in development mode (`__DEV__`):**

   - Reactotron will automatically connect and display logs, network requests, and more.

4. **Access Reactotron features:**
   - Use `console.tron.log()` for custom logs.
   - Inspect AsyncStorage, network requests, and errors.

> **Note:** Reactotron is only enabled in development mode.

## 📱 Features

- Maintenance management
- Kanban board for maintenances
- Comments and file uploads
- Push notifications
- Offline queue for actions

## 📝 License

MIT

---

Developed by Easy Alert Team.
