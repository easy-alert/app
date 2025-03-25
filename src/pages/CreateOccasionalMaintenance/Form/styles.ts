import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    gap: 16,
  },
  dateTimeInput: {
    height: 40,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#b21d1d",
  },
  primaryButtonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  secondaryButtonLabel: {
    fontSize: 14,
    color: "#28a5ff",
  },
});
