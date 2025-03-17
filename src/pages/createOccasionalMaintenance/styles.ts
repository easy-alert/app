import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalFullContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 18, // Espaçamento no topo e na base
    paddingHorizontal: 8, // Espaçamento nas laterais
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
  modalForm: {
    paddingHorizontal: 16,
  },
  modalInputContainer: {
    marginBottom: 16,
  },
  modalInputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalPicker: {
    height: 40,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 8,
  },
  modalInput: {
    height: 40,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  modalButtonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  modalSecondaryLabel: {
    fontSize: 14,
    color: "#28a5ff",
  },
});
