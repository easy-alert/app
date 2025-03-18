import React from "react";
import { View, StyleSheet } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { Routes } from "@/routes";
import { AuthProvider } from "@/contexts/authContext";

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={styles.appContainer}>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Define fundo branco global
  },
});
