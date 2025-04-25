import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  statusContainer: {
    width: Dimensions.get("window").width * 0.85, // Largura da coluna
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 6,
    marginBottom: 30,
    justifyContent: "flex-start",
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  columnContainer: {
    maxHeight: "100%", // Limita a altura da área de cartões, ajuste conforme necessário
  },
});
