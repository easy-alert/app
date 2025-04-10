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
  icon: {
    color: "#B22222",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonLabel: {
    fontSize: 16,
    color: "#333333",
  },
});
