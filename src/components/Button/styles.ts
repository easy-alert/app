import { StyleSheet } from "react-native";

const baseStyle = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export const styles = StyleSheet.create({
  primaryButton: {
    ...baseStyle.button,
    backgroundColor: "#b21d1d",
  },
  primaryButtonLabel: {
    ...baseStyle.buttonLabel,
    color: "#fff",
  },
  secondaryButton: {
    ...baseStyle.button,
  },
  secondaryButtonLabel: {
    ...baseStyle.buttonLabel,
    color: "#75c5ff",
  },
});
