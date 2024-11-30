import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./styles";

export const Splash = ({ navigation }: any) => {
  useEffect(() => {
    const getAsyncStorageVariable = async () => {
      const syndicNanoId = await AsyncStorage.getItem("syndicNanoId");
      const buildingNanoId = await AsyncStorage.getItem("buildingNanoId");

      if (syndicNanoId && buildingNanoId) {
        navigation.replace("Board");
      } else {
        navigation.replace("Login");
      }
    };
    setTimeout(() => {
      getAsyncStorageVariable();
    }, 2000); // Exibe a splash screen por 2 segundos
  }, []);

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Meu App</Text>
      <ActivityIndicator size="large" />
    </View>
  );
};
