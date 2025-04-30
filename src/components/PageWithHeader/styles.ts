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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 8,
  },
  contentPadding: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  button: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
