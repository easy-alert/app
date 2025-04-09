import { StyleSheet } from "react-native";

export const createStyle = (filtersCount: number) =>
  StyleSheet.create({
    button: {
      backgroundColor: filtersCount > 0 ? "#FFCCCC" : "#fff",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      borderColor: filtersCount > 0 ? "#FFCCCC" : "#999999",
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      color: filtersCount > 0 ? "#B22222" : "black",
    },
    countLabel: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#000",
      backgroundColor: "#fff",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
  });
