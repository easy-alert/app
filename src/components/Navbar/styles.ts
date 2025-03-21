import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  navbar: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  hamburgerIcon: {
    position: "absolute",
    left: 16,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
});
