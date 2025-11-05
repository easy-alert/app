import type { TMaintenanceStatus } from "./TMaintenanceStatus";
import type { TMaintenanceType } from "./TMaintenanceType";

export interface IKanbanColumn {
  status: string;
  maintenances: {
    id: string;
    element: string;
    activity: string;
    status: TMaintenanceStatus;
    date: string;
    dueDate: string;
    label: string;
    type: TMaintenanceType;
    buildingName: string;
    inProgress: boolean;
    priorityBackgroundColor: string;
    priorityColor: string;
    priorityLabel: string;
    serviceOrderNumber: number;
    cantReportExpired?: boolean;
  }[];
}
