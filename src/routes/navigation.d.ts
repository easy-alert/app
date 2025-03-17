import type { IHandleCreateOccasionalMaintenance } from "@pages/board";

export interface MaintenanceDetailsProps {
  maintenanceId: string;
  userId: string;
}

export interface CreateOccasionalMaintenanceProps {
  buildingId: string;
  handleCreateOccasionalMaintenance: ({
    occasionalMaintenance,
    occasionalMaintenanceType,
    inProgress,
  }: IHandleCreateOccasionalMaintenance) => void;
}

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Splash: undefined;
      Login: undefined;
      Building: undefined;
      Board: undefined;
      CreateOccasionalMaintenance: CreateOccasionalMaintenanceProps;
      MaintenanceDetails: MaintenanceDetailsProps;
    }
  }
}
