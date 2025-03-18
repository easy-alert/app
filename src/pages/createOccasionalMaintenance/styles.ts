import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  form: {
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  picker: {
    height: 40,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 8,
  },
  input: {
    height: 40,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  secondaryLabel: {
    fontSize: 14,
    color: "#28a5ff",
  },
});
