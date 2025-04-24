import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface MaintenanceDetailsParams {
  maintenanceId: string;
}

interface ProtectedRoutesParams {
  Maintenances: undefined;
  CreateOccasionalMaintenance: undefined;
  MaintenanceDetails: MaintenanceDetailsParams;
}

export type ProtectedNavigation = NativeStackNavigationProp<ProtectedRoutesParams>;

export type RouteList = keyof ProtectedRoutesParams;

export declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends ProtectedRoutesParams {}
  }
}
