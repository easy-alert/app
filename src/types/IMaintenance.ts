import type { IBuilding } from "@/types/IBuilding";
import type { ICategory } from "@/types/ICategory";
import type { IMaintenanceReport } from "@/types/IMaintenanceReport";
import type { IMaintenancesStatus } from "@/types/IMaintenanceStatus";
import type { IUser } from "@/types/IUser";

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
}
