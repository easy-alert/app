// Função para remover fornecedor de uma manutenção
export const saveProgressInMaintenance = async (
  maintenanceId: string,
  cost: number,
  userId: string,
  files?: { originalName: string; url: string | null; name: string }[],
  images?: { originalName: string; url: string | null; name: string }[]
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/client/maintenances/create/report/progress`,
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
          userId,
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
