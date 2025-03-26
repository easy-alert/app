import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ededed",
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#555",
    flex: 1, // Garante que o texto da label não fique espremido
  },
  infoValue: {
    color: "#000",
    flex: 2, // Dá mais espaço ao valor
  },
});
