import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 6,
    marginVertical: 12,
  },
  buildingNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buildingNameLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buildingNameButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  createOccasionalMaintenanceButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  createOccasionalMaintenanceButtonLabel: {
    color: "#333333",
  },
});
