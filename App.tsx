import "./ReactotronConfig";

import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Toaster } from "sonner-native";

import { AuthProvider } from "@/contexts/AuthContext";
import { BottomSheetProvider } from "@/contexts/BottomSheetContext";
import { OfflineQueueProvider } from "@/contexts/OfflineQueueContext";

import { requestPushNotificationPermissions, setNotificationHandler } from "@/utils/pushNotification";

import { Routes } from "@/routes";

setNotificationHandler();

export default function App() {
  useEffect(() => {
    requestPushNotificationPermissions();
  }, []);

  return (
    <GestureHandlerRootView>
      <StatusBar translucent style="dark" />

      <SafeAreaProvider>
        <AuthProvider>
          <BottomSheetProvider>
            <OfflineQueueProvider>
              <Routes />

              <Toaster closeButton richColors position="bottom-center" />
            </OfflineQueueProvider>
          </BottomSheetProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
