// Função para remover fornecedor de uma manutenção
export const startStopMaintenanceProgress = async (
  maintenanceId: string,
  inProgressChange: boolean,
  syndicNanoId: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/client/maintenances/set/in-progress?syndicNanoId=${syndicNanoId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenanceHistoryId: maintenanceId,
          inProgressChange: inProgressChange,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: string = await response.json();

    return data;
  } catch (error) {
    console.error("Erro ao cadastrar atividade em manutenção:", error);
    return null;
  }
};
