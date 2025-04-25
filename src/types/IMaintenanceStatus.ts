export interface IMaintenancesStatus {
  name: "expired" | "pending" | "completed" | "overdue";
}

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
