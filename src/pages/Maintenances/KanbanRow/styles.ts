import { StyleSheet } from "react-native";

import { getStatus } from "@/utils/getStatus";

interface StylesProps {
  columnStatus: string;
  maintenanceType: string;
  maintenanceStatus: string;
}

export const createStyle = ({ columnStatus, maintenanceType, maintenanceStatus }: StylesProps) => {
  return StyleSheet.create({
    card: {
      backgroundColor: "#FAFAFA",
      paddingLeft: 23,
      paddingRight: 16,
      paddingVertical: 16,
      borderRadius: 4,
      marginBottom: 10,
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.08)",
      elevation: 2,
      borderLeftWidth: 9,
      borderLeftColor: getStatus(columnStatus).color,
      gap: 6,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    buildingName: {
      fontSize: 18,
      fontWeight: "bold",
    },
    serviceOrder: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#999999",
    },
    typeTagContainer: {
      paddingVertical: 2,
      paddingHorizontal: 4,
      borderRadius: 4,
      alignSelf: "flex-start",
      backgroundColor: getStatus(maintenanceType).color,
    },
    statusTagContainer: {
      paddingVertical: 2,
      paddingHorizontal: 4,
      borderRadius: 4,
      alignSelf: "flex-start",
      backgroundColor: getStatus(maintenanceStatus).color,
    },
    tagText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "bold",
    },
    priorityName: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#999999",
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#000",
    },
    cardDescription: {
      fontSize: 14,
      color: "#666666",
    },
    completedLabel: {
      maxHeight: "100%",
      color: "#34b53a",
    },
    footerLabel: {
      fontSize: 14,
      fontWeight: "bold",
      color: getStatus(maintenanceStatus).color,
    },
  });
};
