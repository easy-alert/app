export interface MaintenanceDetailsProps {
  maintenanceId: string;
  userId: string;
}

export interface CreateOccasionalMaintenanceProps {
  buildingId: string;
  userId: string;
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
