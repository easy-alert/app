import { StyleSheet } from "react-native";

export const styles = (isSyncing: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      alignItems: "flex-end",
      marginHorizontal: 16,
      marginVertical: 8,
    },
    badgeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: isSyncing ? "#2B7FFF" : "#EF4444",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 999,
    },
    offlineLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
    },
    offlineQueueLengthLabel: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#000",
      backgroundColor: "#fff",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
  });
