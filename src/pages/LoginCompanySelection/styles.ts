import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  companiesContainer: {
    flex: 1,
  },
  companyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCompanyCard: {
    backgroundColor: "#e5e5e5",
  },
  blockedCompanyCard: {
    opacity: 0.5,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    width: "80%",
    flexWrap: "wrap",
  },
  companyImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 16,
    resizeMode: "contain",
  },
  companyImagePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccc",
  },
  companyInitial: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  loadingIndicator: {
    position: "absolute",
    right: 0,
    marginRight: 16,
  },
});
