import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/contexts/AuthContext";
import { Routes } from "@/routes";

export default function App() {
  return (
    <GestureHandlerRootView>
      <StatusBar translucent style="dark" />

      <SafeAreaProvider>
        <View style={styles.appContainer}>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Define fundo branco global
  },
});
