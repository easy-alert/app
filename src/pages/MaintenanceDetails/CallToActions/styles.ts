import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  primaryActionButton: {
    backgroundColor: "#b21d1d",
    padding: 10,
    borderRadius: 8,
  },
  secondaryActionButton: {
    padding: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryActionButtonText: {
    color: "#75c5ff",
    fontWeight: "bold",
  },
});
