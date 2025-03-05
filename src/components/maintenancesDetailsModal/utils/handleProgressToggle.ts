import { startStopMaintenanceProgress } from "../../../services/startStopMaintenanceProgress"; // Ajuste o caminho conforme necessário

export const handleProgressToggle = async (
  userId: string,
  maintenanceId: string | undefined,
  inProgressChange: boolean,
  onCompletion: () => Promise<void> // Callback executado após conclusão
): Promise<void> => {
  if (!maintenanceId) {
    console.error("Maintenance ID é obrigatório.");
    return;
  }

  try {
    await startStopMaintenanceProgress(
      maintenanceId,
      inProgressChange,
      userId
    );
    await onCompletion(); // Executa a lógica adicional passada como callback
  } catch (error) {
    console.error("Erro ao alterar o progresso da manutenção:", error);
  }
};
