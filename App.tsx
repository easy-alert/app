import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";

import { AuthProvider } from "@/contexts/AuthContext";
import { BottomSheetProvider } from "@/contexts/BottomSheetContext";
import { OfflineQueueProvider } from "@/contexts/OfflineQueueContext";
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
        <BottomSheetProvider>
          <AuthProvider>
            <OfflineQueueProvider>
              <Routes />
            </OfflineQueueProvider>
          </AuthProvider>
        </BottomSheetProvider>

        <Toaster closeButton richColors position="bottom-center" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
