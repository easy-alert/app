import { removeSuppliersFromMaintenance } from "../../../services/removeSuppliersFromMaintenance"; // Ajuste o caminho conforme necessário

export const handleRemoveSupplier = async (
  supplierId: string,
  maintenanceId: string | undefined,
  userId: string,
  onCompletion: () => Promise<void> // Callback executado após conclusão
): Promise<void> => {
  if (!maintenanceId || !userId || !supplierId) {
    console.error("Maintenance ID, Syndic ID ou Supplier ID está indefinido.");
    return;
  }

  try {
    await removeSuppliersFromMaintenance(
      supplierId,
      maintenanceId,
      userId,
    );
    console.log("Fornecedor removido com sucesso.");
    await onCompletion(); // Executa o callback para ações adicionais, como recarregar dados
  } catch (error) {
    console.error("Erro ao remover fornecedor:", error);
  }
};
