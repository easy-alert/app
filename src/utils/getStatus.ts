export const getStatus = (status: string): { color: string; label: string } => {
  const statusMap: Record<string, { color: string; label: string }> = {
    Vencidas: { color: "#FD2C19", label: "Vencidas" },
    expired: { color: "#FD2C19", label: "Vencida" },
    Pendentes: { color: "#FEA628", label: "Pendentes" },
    pending: { color: "#FEA628", label: "Pendente" },
    "Em execução": { color: "#269EFB", label: "Em execução" },
    Concluídas: { color: "#33AB3D", label: "Concluídas" },
    completed: { color: "#33AB3D", label: "Concluída" },
    overdue: { color: "#E15A5D", label: "Feita em atraso" },
    common: { color: "#1074A8", label: "Preventiva" },
    occasional: { color: "#7D29D5", label: "Avulsa" },
  };

  return statusMap[status] || { color: "gray", label: "Desconhecido" };
};

export const maintenanceStatus = [
  {
    value: "expired",
    label: "Vencida",
  },
  {
    value: "pending",
    label: "Pendente",
  },
  {
    value: "completed",
    label: "Concluída",
  },
  {
    value: "overdue",
    label: "Feita em atraso",
  },
];
