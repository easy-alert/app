export const MAINTENANCE_STATUS = [
  {
    value: "expired",
    label: "Expirada",
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
export type TMaintenanceStatus = (typeof MAINTENANCE_STATUS)[number]["value"];
