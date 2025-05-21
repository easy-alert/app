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
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.08)", // Sombra para o card
      elevation: 2, // Elevação para sombra no Android
      borderLeftWidth: 9,
      borderLeftColor: getStatus(columnStatus).color,
      gap: 6,
    },
    buildingName: {
      fontSize: 18,
    },
    typeTagContainer: {
      paddingVertical: 2,
      paddingHorizontal: 4,
      borderRadius: 4,
      alignSelf: "flex-start", // Ajusta o tamanho ao conteúdo
      backgroundColor: getStatus(maintenanceType).color,
    },
    statusTagContainer: {
      paddingVertical: 2,
      paddingHorizontal: 4,
      borderRadius: 4,
      alignSelf: "flex-start", // Ajusta o tamanho ao conteúdo
      backgroundColor: getStatus(maintenanceStatus).color,
    },
    tagText: {
      color: "#ffffff", // Texto branco
      fontSize: 12,
      fontWeight: "bold",
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#000", // Cor do texto principal
    },
    cardDescription: {
      fontSize: 14,
      color: "#666666", // Cinza para o texto secundário
    },
    completedLabel: {
      maxHeight: "100%", // Limita a altura da área de cartões, ajuste conforme necessário
      color: "#34b53a",
    },
    footerLabel: {
      fontSize: 14,
      fontWeight: "bold",
      color: getStatus(maintenanceStatus).color,
    },
  });
};
