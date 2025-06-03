import type { ICategory } from "./ICategory";

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
    name: string;
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
  MaintenanceReport: {
    id: string;
    cost: number;
    observation: string;
    ReportImages: {
      url: string;
    }[];
  }[];
  MaintenancesStatus: {
    name: "expired" | "pending" | "completed" | "overdue";
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
