import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/contexts/AuthContext";
import { BottomSheetProvider } from "@/contexts/BottomSheetContext";
import { Routes } from "@/routes";
import { requestPushNotificationPermissions, setNotificationHandler } from "@/utils/pushNotification";

setNotificationHandler();

export default function App() {
  useEffect(() => {
    requestPushNotificationPermissions();
  }, []);

  return (
    <GestureHandlerRootView>
      <StatusBar translucent style="dark" />

      <SafeAreaProvider>
        <View style={styles.appContainer}>
          <BottomSheetProvider>
            <AuthProvider>
              <Routes />
            </AuthProvider>
          </BottomSheetProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#EAEAEA",
  },
});
