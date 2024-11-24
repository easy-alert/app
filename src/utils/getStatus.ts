export const getStatus = (status: string): { color: string; label: string } => {
  const statusMap: Record<string, { color: string; label: string }> = {
    Vencidas: { color: "red", label: "Vencidas" },
    expired: { color: "red", label: "Vencida" },
    Pendentes: { color: "orange", label: "Pendentes" },
    pending: { color: "orange", label: "Pendente" },
    "Em execução": { color: "blue", label: "Em execução" },
    Concluídas: { color: "green", label: "Concluídas" },
    completed: { color: "green", label: "Concluída" },
    overdue: { color: "green", label: "Feita em atraso" },
  };

  return statusMap[status] || { color: "gray", label: "Desconhecido" };
};
