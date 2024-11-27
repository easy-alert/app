export interface MaintenanceDetails {
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
  MaintenanceReport: MaintenanceReport;
  MaintenancesStatus: {
    name: string;
  };
  Building: Building;
  Maintenance: Maintenance;
}

export interface MaintenanceDetailsData {
  MaintenanceDetails: MaintenanceDetails;
}

export interface MaintenanceHistoryActivities {
  maintenanceHistoryActivities: MaintenanceHistory[];
}

export interface MaintenanceHistory {
  id: string;
  maintenanceHistoryId: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
}

export interface Supplier {
  suppliers: never[];
  image: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  categories: any[];
  isSelected: boolean;
}

export interface SuppliersByMaintenanceId {
  remainingSuppliers: Supplier[];
  suggestedSuppliers: Supplier[];
}

export interface MaintenanceReport {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexes: ReportAnnexes[];
  ReportImages: ReportImages[];
}

export interface ReportAnnexes {
  name: string;
  originalName: string;
  url: string;
}

export interface ReportImages {
  name: string;
  originalName: string;
  url: string;
}

export interface Maintenance {
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

export interface Building {
  name: string;
  id: string;
  guestCanCompleteMaintenance: boolean;
}

export interface KanbanColumn {
  status: string; // Exemplo: 'Vencidas', 'Pendentes', etc.
  maintenances: MaintenanceDetails[];
}

export interface FilterCategory {
  id: string;
  name: string;
}

export interface FilterStatus {
  name: string; // Exemplo: 'completed'
  label: string; // Exemplo: 'concluídas'
}

export interface FilterMonth {
  monthNumber: string; // Exemplo: '01'
  label: string; // Exemplo: 'janeiro'
}

export interface Filters {
  years: string[]; // Exemplo: ['2024', '2025']
  months: FilterMonth[];
  status: FilterStatus[];
  categories: FilterCategory[];
}

export interface MaintenancesBySyndicNanoId {
  buildingName: string; // Nome do edifício
  kanban: KanbanColumn[]; // Colunas do Kanban
  Filters: Filters; // Filtros disponíveis
}

export interface Buildings {
  buildingNanoId: string;
  buildingName: string;
  syndicNanoId: string;
  companyName: string;
  syndicName: string;
  label: string;
}

export interface BuildingsBySyndicId {
  buildings: Buildings[]; // Nome do edifício
}
