import { StyleSheet } from "react-native";

export const iconColor = "#b21d1d";
export const disabledIconColor = "lightgray";

export const commonStyles = StyleSheet.create({
  input: {
    minHeight: 44,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputPlaceholderLabel: {
    fontSize: 14,
    color: "gray",
  },
  inputContentLabel: {
    fontSize: 14,
    color: "black",
  },
  dropdownContainer: {
    borderRadius: 8,
  },
});
