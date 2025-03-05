// Função para remover fornecedor de uma manutenção
export const removeSuppliersFromMaintenance = async (
  supplierId: string,
  maintenanceId: string,
  userId: string,
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://easyalert-production.herokuapp.com/api/company/suppliers/unlink-to-maintenance-history`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplierId: supplierId,
          maintenanceHistoryId: maintenanceId,
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
