import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  modalContent: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
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
});
