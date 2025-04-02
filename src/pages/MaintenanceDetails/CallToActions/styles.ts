import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#b21d1d",
    padding: 10,
    borderRadius: 8,
  },
  secondaryButton: {
    padding: 10,
    borderRadius: 8,
  },
  primaryButtonLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryButtonLabel: {
    color: "#75c5ff",
    fontWeight: "bold",
  },
});
