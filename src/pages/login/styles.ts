import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3F3E3E",
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  label: {
    width: "100%",
    fontSize: 16,
    marginBottom: 8,
    color: "#FFF",
  },
  input: {
    width: "100%", // Define a largura do input para ocupar toda a tela
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  logo: {
    justifyContent: "center",
    resizeMode: "contain",
    marginBottom: 60,
  },
  button: {
    backgroundColor: "#B21D1D",
    color: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
