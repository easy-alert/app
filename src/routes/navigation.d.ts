import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface CreateOccasionalMaintenanceParams {
  buildingId: string;
  userId: string;
}

export interface MaintenanceDetailsParams {
  maintenanceId: string;
  userId: string;
}

interface RoutesParams {
  Splash: undefined;
  Login: undefined;
  Building: undefined;
  Board: undefined;
  CreateOccasionalMaintenance: CreateOccasionalMaintenanceParams;
  MaintenanceDetails: MaintenanceDetailsParams;
}

export type Navigation = NativeStackNavigationProp<RoutesParams>;

export declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RoutesParams {}
  }
}
