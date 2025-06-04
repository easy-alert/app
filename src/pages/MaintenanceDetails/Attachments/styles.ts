import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  contentContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 20,
  },
  pickerButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  fileList: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fileItem: {
    backgroundColor: "#ffcdd2",
    borderRadius: 8,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  fileName: {
    fontSize: 12,
    color: "#c62828",
    maxWidth: 100,
  },
  deleteIcon: {
    backgroundColor: "#c62828",
    borderRadius: 50,
    padding: 2,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
});
