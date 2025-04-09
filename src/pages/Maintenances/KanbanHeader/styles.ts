import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 6,
    marginVertical: 12,
  },
  buildingNameButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  buildingNameLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },
  createOccasionalMaintenanceButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  createOccasionalMaintenanceButtonLabel: {
    color: "#333333",
  },
});
