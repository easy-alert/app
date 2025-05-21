import { StyleSheet } from "react-native";

const baseStyle = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonLoading: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
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
  primaryButtonLoading: {
    ...baseStyle.buttonLoading,
    backgroundColor: "#b21d1d",
  },
  secondaryButton: {
    ...baseStyle.button,
  },
  secondaryButtonLabel: {
    ...baseStyle.buttonLabel,
    color: "#75c5ff",
  },
  secondaryButtonLoading: {
    ...baseStyle.buttonLoading,
    backgroundColor: "#fff",
  },
});
