import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Routes } from "@/routes";
import { Splash } from "@/components/splash";
import { RouteList } from "@/routes/navigation";

export default function App() {
  const [initialRoute, setInitialRoute] = useState<RouteList | null>(null);

  useEffect(() => {
    const getAsyncStorageData = async () => {
      const syndicNanoId = await AsyncStorage.getItem("syndicNanoId");
      const buildingNanoId = await AsyncStorage.getItem("buildingNanoId");

      // TODO: aparentemente não está funcionando

      setInitialRoute(syndicNanoId && buildingNanoId ? "Board" : "Login");
    };

    setTimeout(() => {
      getAsyncStorageData();
    }, 2000); // Exibe a splash screen por 2 segundos
  }, []);

  if (!initialRoute) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={styles.appContainer}>
        <Routes initialRoute={initialRoute} />
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
