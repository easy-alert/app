import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface MaintenanceDetailsParams {
  maintenanceId: string;
}

interface RoutesParams {
  Maintenances: undefined;
  CreateOccasionalMaintenance: undefined;
  MaintenanceDetails: MaintenanceDetailsParams;
}

export type Navigation = NativeStackNavigationProp<RoutesParams>;

export type RouteList = keyof RoutesParams;

export declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RoutesParams {}
  }
}
