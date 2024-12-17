import { StyleSheet, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  statusContainer: {
    width: Dimensions.get("window").width * 0.85, // Largura da coluna
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 6,
    marginTop: 24,
    marginBottom: 30,
    justifyContent: "flex-start",
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardsContainer: {
    maxHeight: "100%", // Limita a altura da área de cartões, ajuste conforme necessário
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5, // Define a borda esquerda
    borderLeftColor: "orange", // Cor inicial da borda
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Elevação para sombra no Android
  },
  tag: {
    backgroundColor: "#007BFF", // Azul para a etiqueta
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start", // Ajusta o tamanho ao conteúdo
    marginBottom: 8,
  },
  tagText: {
    color: "#ffffff", // Texto branco
    fontSize: 12,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000", // Cor do texto principal
  },
  cardDescription: {
    fontSize: 14,
    color: "#666666", // Cinza para o texto secundário
    marginBottom: 8,
  },
  cardFooter: {
    fontSize: 14,
    color: "#FFA500", // Laranja para o texto adicional
    fontWeight: "bold",
  },
  cardBorder: {
    borderLeftWidth: 5, // Define a borda na lateral esquerda
    borderLeftColor: "red", // Cor da borda
  },
  modalContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007BFF",
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalFullContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 16, // Espaçamento no topo e na base
    paddingHorizontal: 24, // Espaçamento nas laterais
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalCloseButton: {
    padding: 8,
  },
  modalBuildingName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalTags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  modalContent: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 8,
  },
  modalInfoLabel: {
    fontWeight: "bold",
    color: "#555",
    flex: 1, // Garante que o texto da label não fique espremido
  },
  modalInfoValue: {
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
  supplierAvatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  supplierOption: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  supplierOptionText: {
    fontSize: 14,
    color: "#000",
  },
  noSuppliersText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  linkToRegister: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
  },
  linkText: {
    color: "#D9534F",
    fontWeight: "bold",
    textDecorationLine: "underline",
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
  uploadButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
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
  imageFileItem: {
    backgroundColor: "#ffcdd2",
    borderRadius: 8,
    padding: 5,
    flexDirection: "column",
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
    justifyContent: "space-around",
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: "#c62828",
    padding: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
