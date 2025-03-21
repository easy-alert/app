import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: "#fff",
  },
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
});
