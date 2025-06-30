import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  unlinkButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 14,
    color: "gray",
    marginRight: 4,
  },
  buttonIcon: {
    marginLeft: 4,
    padding: 6,
    borderRadius: 16,
    backgroundColor: "#D9534F",
  },
  supplierContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 12,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
  },
  nameLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  emailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  websiteLabel: {
    fontSize: 14,
    color: "#666",
  },
});
