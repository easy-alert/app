import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ededed",
    borderRadius: 8,
    marginBottom: 8,
  },
  titleLabel: {
    fontWeight: "bold",
    color: "#555",
    flex: 1,
  },
  valueLabel: {
    color: "#000",
    flex: 2,
  },
});
