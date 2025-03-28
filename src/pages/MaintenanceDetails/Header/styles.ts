import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tagContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignSelf: "flex-start", // Ajusta o tamanho ao conteúdo
  },
  tagLabel: {
    color: "#ffffff", // Texto branco
    fontSize: 12,
    fontWeight: "bold",
  },
});
