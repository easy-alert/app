import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 6,
    marginVertical: 12,
    gap: 12,
  },
  buildingNameButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  buildingNameLabel: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    color: "#B22222",
  },
});
