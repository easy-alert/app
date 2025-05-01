import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  titleLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    gap: 12,
  },
  cardImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#DDD",
    borderRadius: 999,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  separator: {
    height: "100%",
    width: 2,
    backgroundColor: "#B21C1D",
  },
  cardTextContainer: {
    gap: 12,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
