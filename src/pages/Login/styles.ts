import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#2e2e2e",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  passwordContainer: {
    display: "flex",
    flexDirection: "row",
  },
  logo: {
    width: 150,
    height: 34,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#444",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#555",
  },
  icon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  buttonContainer: {
    height: 50,
    width: "100%",
    justifyContent: "center",
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#c62828",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    marginTop: 16,
    color: "#fff",
    fontSize: 16,
  },
  forgotPasswordTextLink: {
    fontWeight: "bold",
  },
});
