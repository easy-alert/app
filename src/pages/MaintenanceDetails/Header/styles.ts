import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 8,
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tagContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  tagLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
