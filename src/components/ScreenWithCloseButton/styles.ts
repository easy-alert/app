import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContainer: {
    backgroundColor: "#fff",
    paddingBottom: 32,
  },
  contentPadding: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeIcon: {
    padding: 8,
  },
});
