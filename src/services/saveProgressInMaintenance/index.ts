// Função para remover fornecedor de uma manutenção
export const saveProgressInMaintenance = async (
  maintenanceId: string,
  cost: number,
  syndicNanoId: string,
  files?: never[],
  images?: never[]
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/client/maintenances/create/report/progress?syndicNanoId=${syndicNanoId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenanceHistoryId: maintenanceId,
          cost: cost,
          observation: null,
          ReportAnnexes: files,
          ReportImages: images,
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
