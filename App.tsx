import React from "react";
import { View, StyleSheet } from "react-native";
import { Board } from "./src/pages/board";

export default function App() {
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
