import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  commentSection: {
    marginTop: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 6,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top", // Alinha o texto no topo
    minHeight: 100, // Altura mínima
    backgroundColor: "#fff",
  },
  commentButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  commentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#B22222", // Vermelho
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  uploadedFilesContainer: {
    marginTop: 10,
  },
  uploadedFileItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 8,
  },
  uploadedFileDetails: {
    flex: 1,
  },
  uploadedFileName: {
    fontSize: 14,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#c62828",
    borderRadius: 50,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
