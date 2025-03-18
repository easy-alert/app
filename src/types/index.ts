export interface ICategory {
  id?: string;
  ownerCompanyId?: string;
  categoryTypeId?: string;

  name?: string;

  createdAt?: string;
  updatedAt?: string;
}

// TODO: alterar para IMaintenanceDetails
interface MaintenanceDetails {
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

export interface MaintenanceHistoryActivities {
  maintenanceHistoryActivities: MaintenanceHistory[];
}

export interface UploadedFile {
  name?: string;
  originalName: string | null;
  url: string;
  type?: string;
}

interface MaintenanceHistory {
  id: string;
  maintenanceHistoryId: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images: ImageHistory[];
}

interface ImageHistory {
  id: string;
  name: string;
  url: string;
}

interface Supplier {
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

interface MaintenanceReport {
  id: string;
  cost: number | undefined;
  observation: string;
  ReportAnnexes: ReportAnnexes[];
  ReportImages: ReportImages[];
}

export interface MaintenanceReportProgress {
  id: string;
  cost: number;
  observation: string;
  ReportAnnexesProgress: ReportAnnexes[];
  ReportImagesProgress: ReportImages[];
}

interface ReportAnnexes {
  name: string;
  originalName: string;
  url: string;
}

interface ReportImages {
  name: string;
  originalName: string;
  url: string;
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

interface Building {
  name: string;
  id: string;
  guestCanCompleteMaintenance: boolean;
}

export interface KanbanColumn {
  status: string; // Exemplo: 'Vencidas', 'Pendentes', etc.
  maintenances: MaintenanceDetails[];
}

export interface IAnnexesAndImages {
  name: string;
  originalName: string;
  url: string;
  type?: string;
}

export type IOccasionalMaintenanceType = "pending" | "finished" | "";

export interface IOccasionalMaintenanceData {
  buildingId: string;

  element: string;
  activity: string;
  responsible: string;
  executionDate: string;

  inProgress: boolean;

  priorityName: string;

  categoryData: {
    id: string;
    name: string;
  };

  reportData: {
    cost: string;
    observation: string;
    files: IAnnexesAndImages[];
    images: IAnnexesAndImages[];
  };
}
