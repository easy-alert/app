import React from "react";
import { View, StyleSheet } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { StatusBar } from "expo-status-bar";

import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/layouts/MainLayout";

export default function App() {
  return (
    <>
      <StatusBar translucent style="dark" />

      <SafeAreaProvider>
        <View style={styles.appContainer}>
          <AuthProvider>
            <MainLayout />
          </AuthProvider>
        </View>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Define fundo branco global
  },
});
