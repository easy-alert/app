// TODO: reutilizar
interface ReportAnnexes {
  name: string;
  originalName: string;
  url: string;
}

// TODO: reutilizar
interface ReportImages {
  name: string;
  originalName: string;
  url: string;
}

// TODO: reutilizar
interface MaintenanceReport {
  id: string;
  cost: number | undefined;
  observation: string;
  ReportAnnexes: ReportAnnexes[];
  ReportImages: ReportImages[];
}

// TODO: reutilizar
export interface MaintenanceReportProgress {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexesProgress: ReportAnnexes[];
  ReportImagesProgress: ReportImages[];
}

interface Maintenance {
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

// TODO: reutilizar
interface Building {
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
  MaintenanceReport: MaintenanceReport[];
  MaintenanceReportProgress: MaintenanceReportProgress[];
  MaintenancesStatus: {
    name: string;
  };
  Building: Building;
  Maintenance: Maintenance;
}

export interface KanbanColumn {
  status: string; // Exemplo: 'Vencidas', 'Pendentes', etc.
  maintenances: IMaintenanceDetails[];
}
