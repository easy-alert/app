import { StyleSheet } from "react-native";

export const createStyle = (isSyncing: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: isSyncing ? "#2B7FFF" : "#EF4444",
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: 999,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#fff",
    },
    countContainer: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff",
      borderRadius: 999,
      minWidth: 16,
      minHeight: 16,
      paddingHorizontal: 4,
    },
    countLabel: {
      fontSize: 10,
      fontWeight: "bold",
      color: "#000",
    },
  });
