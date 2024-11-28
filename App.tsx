import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Board } from "./src/pages/board";

export default function App() {
  useEffect(() => {
    const setAsyncStorageVariable = async () => {
      await AsyncStorage.setItem("syndicNanoId", "Fr8aLc-krzQn");
      await AsyncStorage.setItem("buildingNanoId", "H7q61JMw0-yR");
    };
    setAsyncStorageVariable();
  }, []); // Executa apenas no carregamento inicial

  return (
    <View style={styles.appContainer}>
      <Board />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Define fundo branco global
  },
});
