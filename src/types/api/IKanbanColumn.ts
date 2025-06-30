export interface IKanbanColumn {
  status: string;
  maintenances: {
    id: string;
    element: string;
    activity: string;
    status: string;
    cantReportExpired?: boolean;
    date: string;
    label: string;
    type: string;
    buildingName: string;
  }[];
}
