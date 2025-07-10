import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  statusContainer: {
    width: Dimensions.get("window").width * 0.85,
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 6,
    marginBottom: 30,
    justifyContent: "flex-start",
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  checkbox: {
    marginLeft: 8,
  },
  columnContainer: {
    maxHeight: "100%",
  },
});
