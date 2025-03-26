import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignSelf: "flex-start", // Ajusta o tamanho ao conteúdo
  },
  tagText: {
    color: "#ffffff", // Texto branco
    fontSize: 12,
    fontWeight: "bold",
  },
  buildingName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
});
