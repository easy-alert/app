export interface IKanbanColumn {
  status: string; // Exemplo: 'Vencidas', 'Pendentes', etc.
  maintenances: {
    id: string;
    element: string;
    activity: string;
    status: string; // Pode ser 'expired', 'pending', 'completed', 'overdue', etc.
    cantReportExpired?: boolean;
    date: string; // ISO 8601 string
    label: string;
    type: string; // Exemplo: 'common'
    buildingName: string;
  }[];
}
