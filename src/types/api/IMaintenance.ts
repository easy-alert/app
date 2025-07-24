import type { ICategory } from "./ICategory";
import type { TMaintenanceStatus } from "./TMaintenanceStatus";
import type { TMaintenanceType } from "./TMaintenanceType";

interface IMaintenanceData {
  Category: ICategory;
  activity: string;
  element: string;
  observation: string;
  responsible: string;
  source: string;

  frequency: number;
  FrequencyTimeInterval: {
    pluralLabel: string;
    singularLabel: string;
    unitTime: number;
  };

  MaintenanceType: {
    name: TMaintenanceType;
  };

  instructions: {
    name: string;
    url: string;
  }[];
}

export interface IMaintenance {
  id: string;

  dueDate: string;
  resolutionDate: string;
  notificationDate: string;

  MaintenanceReport?: {
    id: string;
    cost: number;
    observation: string;
    ReportAnnexes: {
      name: string;
      url: string;
    }[];
    ReportImages: {
      name: string;
      originalName: string;
      url: string;
    }[];
  }[];

  MaintenanceReportProgress?: {
    id: string;
    cost: number;
    observation: string;
    ReportAnnexesProgress: {
      name: string;
      originalName: string;
      url: string;
    }[];
    ReportImagesProgress: {
      name: string;
      originalName: string;
      url: string;
    }[];
  }[];

  MaintenancesStatus: {
    name: TMaintenanceStatus;
  };

  Building: {
    id?: string;
    name?: string;
  };

  Maintenance: IMaintenanceData;

  Users: {
    User: {
      name: string;
      image: string;
      email: string;
    };
  }[];

  canReport: boolean;
  inProgress: boolean;
  showToResident: boolean;
}
