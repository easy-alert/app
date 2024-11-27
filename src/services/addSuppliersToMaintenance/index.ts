// Função para remover fornecedor de uma manutenção
export const addSuppliersToMaintenance = async (
  maintenanceId: string,
  syndicNanoId: string,
  supplierId: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/client/suppliers/link-to-maintenance-history?syndicNanoId=${syndicNanoId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenanceHistoryId: maintenanceId,
          supplierId: supplierId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: string = await response.json();

    return data;
  } catch (error) {
    console.error("Erro ao remover fornecedor da manutenção:", error);
    return null;
  }
};
