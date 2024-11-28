// Função para remover fornecedor de uma manutenção
export const addMaintenanceHistoryActivity = async (
  maintenanceId: string,
  syndicNanoId: string,
  content: string,
  uploadedFile?: never[]
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/client/maintenance-history-activities`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenanceHistoryId: maintenanceId,
          syndicNanoId: syndicNanoId,
          content: content,
          images: uploadedFile,
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
