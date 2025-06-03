import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2B7FFF",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  countContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 999,
    minWidth: 16,
    minHeight: 16,
    paddingHorizontal: 4,
  },
  countLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000",
  },
});
