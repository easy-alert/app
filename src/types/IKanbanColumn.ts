interface IReportAnnexes {
  name: string;
  originalName: string;
  url: string;
}

interface IReportImages {
  name: string;
  originalName: string;
  url: string;
}

interface IMaintenanceReport {
  id: string;
  cost: number | undefined;
  observation: string;
  ReportAnnexes: IReportAnnexes[];
  ReportImages: IReportImages[];
}

interface IMaintenanceReportProgress {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexesProgress: IReportAnnexes[];
  ReportImagesProgress: IReportImages[];
}

interface IMaintenance {
  Category: {
    name: string;
  };
  id: string;
  element: string;
  activity: string;
  responsible: string;
  source: string;
  observation: string;
  period: number;
  frequency: number;
  FrequencyTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
  };
  PeriodTimeInterval: {
    unitTime: string;
  };
  MaintenanceType: {
    name: string;
  };
  instructions: any[];
}

interface IBuilding {
  name: string;
  id: string;
  guestCanCompleteMaintenance: boolean;
}

interface IMaintenanceDetails {
  id: string;
  element: string;
  activity: string;
  status: string; // Pode ser 'expired', 'pending', 'completed', 'overdue', etc.
  cantReportExpired?: boolean;
  date: string; // ISO 8601 string
  dueDate: string; // ISO 8601 string
  label: string;
  type: string; // Exemplo: 'common'
  inProgress: boolean;
  notificationDate: string;
  resolutionDate: string;
  daysInAdvance: number;
  canReport: boolean;
  MaintenanceReport: IMaintenanceReport[];
  MaintenanceReportProgress: IMaintenanceReportProgress[];
  MaintenancesStatus: {
    name: string;
  };
  Building: IBuilding;
  Maintenance: IMaintenance;
}

export interface IKanbanColumn {
  status: string; // Exemplo: 'Vencidas', 'Pendentes', etc.
  maintenances: IMaintenanceDetails[];
}
