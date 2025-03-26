import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  historyTabs: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 12,
  },
  historyTabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  activeTabButton: {
    backgroundColor: "#FFCCCC",
  },
  historyTabText: {
    fontSize: 16,
    color: "#333",
  },
  activeTabText: {
    color: "#B22222",
    fontWeight: "bold",
  },
  historyList: {
    marginTop: 0,
  },
  historyItem: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 6,
  },
  historyIconContainer: {
    marginRight: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B22222", // Vermelho
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  historyTimestamp: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  historyDescription: {
    fontSize: 14,
    color: "#333",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  imageItem: {
    width: 80,
    height: 100,
    marginRight: 10,
    alignItems: "center",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
  imageName: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
  },
});
