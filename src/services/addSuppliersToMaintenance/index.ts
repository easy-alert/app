// Função para remover fornecedor de uma manutenção
export const addSuppliersToMaintenance = async (
  maintenanceId: string,
  userId: string,
  supplierId: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/company/suppliers/link-to-maintenance-history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenanceHistoryId: maintenanceId,
          supplierId: supplierId,
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
    console.error("Erro ao remover fornecedor da manutenção:", error);
    return null;
  }
};
