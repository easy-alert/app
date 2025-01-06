import { StyleSheet, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  statusContainer: {
    width: Dimensions.get("window").width * 0.85, // Largura da coluna
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginHorizontal: 6,
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
    backgroundColor: "#FAFAFA",
    paddingLeft: 23,
    paddingRight: 16,
    paddingVertical: 16,
    borderRadius: 4,
    marginBottom: 10,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.08)", // Sombra para o card
    elevation: 2, // Elevação para sombra no Android
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignSelf: "flex-start", // Ajusta o tamanho ao conteúdo
    marginBottom: 8,
  },
  tagText: {
    color: "#ffffff", // Texto branco
    fontSize: 10,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 14,
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
});
