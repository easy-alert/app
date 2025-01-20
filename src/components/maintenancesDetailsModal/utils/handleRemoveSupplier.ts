import { removeSuppliersFromMaintenance } from "../../../services/removeSuppliersFromMaintenance"; // Ajuste o caminho conforme necessário

export const handleRemoveSupplier = async (
  syndicNanoId: string,
  maintenanceId: string | undefined,
  supplierId: string,
  onCompletion: () => Promise<void> // Callback executado após conclusão
): Promise<void> => {
  if (!maintenanceId || !syndicNanoId || !supplierId) {
    console.error("Maintenance ID, Syndic ID ou Supplier ID está indefinido.");
    return;
  }

  try {
    await removeSuppliersFromMaintenance(
      maintenanceId,
      syndicNanoId,
      supplierId
    );
    console.log("Fornecedor removido com sucesso.");
    await onCompletion(); // Executa o callback para ações adicionais, como recarregar dados
  } catch (error) {
    console.error("Erro ao remover fornecedor:", error);
  }
};
