export interface IKanbanColumn {
  status: string;
  maintenances: {
    id: string;
    element: string;
    activity: string;
    status: string;
    date: string;
    dueDate: string;
    label: string;
    type: string;
    buildingName: string;
    inProgress: boolean;
    priorityBackgroundColor: string;
    priorityColor: string;
    priorityLabel: string;
    serviceOrderNumber: number;
    cantReportExpired?: boolean;
  }[];
}
