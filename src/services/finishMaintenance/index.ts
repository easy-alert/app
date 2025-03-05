import { Alert } from "react-native";

// Função para remover fornecedor de uma manutenção
export const finishMaintenance = async (
  maintenanceId: string,
  cost: number,
  userId: string,
  files?: { originalName: string; url: string | null; name: string }[],
  images?: { originalName: string; url: string | null; name: string }[]
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/client/maintenances/create/report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: "Client",
          maintenanceHistoryId: maintenanceId,
          cost: cost,
          observation: null,
          ReportAnnexes: files,
          ReportImages: images,
          userId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData?.ServerMessage?.message || "Erro desconhecido.";
      Alert.alert("Erro ao finalizar manutenção", errorMessage);
      return null;
    }
    const data: string = await response.json();

    return data;
  } catch (error) {
    console.error("Erro ao finalizar manutenção:", error);
    Alert.alert("Erro ao finalizar manutenção");
    return null;
  }
};
