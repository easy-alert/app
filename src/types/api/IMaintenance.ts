import type { IBuilding } from "./IBuilding";
import type { ICategory } from "./ICategory";
import type { IMaintenanceReport } from "./IMaintenanceReport";
import type { IMaintenancesStatus } from "./IMaintenanceStatus";
import type { IUser } from "./IUser";

export interface IMaintenance {
  id: string;
  dueDate: string;
  resolutionDate: string;
  notificationDate: string;
  MaintenanceReport: IMaintenanceReport[];
  MaintenancesStatus: IMaintenancesStatus;
  Building: IBuilding;
  Maintenance: {
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

    instructions: { name: string; url: string }[];
  };
  Users: {
    User: {
      id: string;
      name: string;
      image: string;
      email: string;
    };
  }[];
  canReport: boolean;
  inProgress: boolean;
  daysInAdvance: number;
  additionalInfo?: string;
  userResponsible?: IUser;
  showToResident: boolean;
}
