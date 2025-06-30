import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    marginTop: 4,
    marginBottom: 20,
  },
  readonlyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ededed",
    borderRadius: 8,
    marginBottom: 8,
  },
  readonlyTitleLabel: {
    fontWeight: "bold",
    color: "#555",
    flex: 1,
  },
  readonlyValueLabel: {
    color: "#000",
    flex: 2,
  },
});
