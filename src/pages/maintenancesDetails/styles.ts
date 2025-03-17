import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semitransparente
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fundo escuro transparente
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignSelf: "flex-start", // Ajusta o tamanho ao conteúdo
  },
  tagText: {
    color: "#ffffff", // Texto branco
    fontSize: 12,
    fontWeight: "bold",
  },
  fullContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 18, // Espaçamento no topo e na base
    paddingHorizontal: 8, // Espaçamento nas laterais
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ededed",
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#555",
    flex: 1, // Garante que o texto da label não fique espremido
  },
  infoValue: {
    color: "#000",
    flex: 2, // Dá mais espaço ao valor
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  unlinkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unlinkText: {
    fontSize: 14,
    color: "gray",
    marginRight: 4,
  },
  unlinkIcon: {
    marginLeft: 4,
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#D9534F", // Vermelho
  },
  supplierContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Fundo cinza claro
    padding: 12,
    borderRadius: 8,
  },
  supplierDetails: {
    flex: 1,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  supplierEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  supplierWebsite: {
    fontSize: 14,
    color: "#666",
  },
  supplierAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Deixa a imagem redonda
    overflow: "hidden", // Garante que a borda redonda funcione corretamente
    marginRight: 12,
  },
  supplierAvatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Mantém a proporção da imagem
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
  historyTabs: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 12,
  },
  historyTabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  activeTabButton: {
    backgroundColor: "#FFCCCC",
  },
  historyTabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#B22222",
    fontWeight: "bold",
  },
  historyList: {
    marginTop: 0,
  },
  historyItem: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 6,
  },
  historyIconContainer: {
    marginRight: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B22222", // Vermelho
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  historyTimestamp: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  historyDescription: {
    fontSize: 14,
    color: "#333",
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
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  imageItem: {
    width: 80,
    height: 100,
    marginRight: 10,
    alignItems: "center",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
  imageName: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
  },
  container: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  uploadContainer: {
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  primaryActionButton: {
    backgroundColor: "#b21d1d",
    padding: 10,
    borderRadius: 8,
  },
  secondaryActionButton: {
    padding: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryActionButtonText: {
    color: "#75c5ff",
    fontWeight: "bold",
  },
});
