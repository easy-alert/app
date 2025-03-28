import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  fileList: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  fileItem: {
    backgroundColor: "#ffcdd2",
    borderRadius: 8,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10,
  },
  fileName: {
    fontSize: 12,
    color: "#c62828",
    marginRight: 5,
    maxWidth: 100,
  },
  deleteIcon: {
    backgroundColor: "#c62828",
    borderRadius: 50,
    padding: 2,
    marginLeft: 4,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
});
