import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 12,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  activeTabButton: {
    backgroundColor: "#FFCCCC",
  },
  tabButtonLabel: {
    fontSize: 16,
    color: "#333",
  },
  activeTabButtonLabel: {
    color: "#B22222",
    fontWeight: "bold",
  },
  listContainer: {
    maxHeight: 200,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 6,
  },
  itemIconContainer: {
    marginRight: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B22222", // Vermelho
  },
  itemContentContainer: {
    flex: 1,
  },
  itemTitleLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemTimestampLabel: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  itemDescriptionLabel: {
    fontSize: 14,
    color: "#333",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  imageItemContainer: {
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
  imageNameLabel: {
    fontSize: 10,
    color: "#333",
    textAlign: "center",
  },
});
