import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface MaintenanceDetailsParams {
  maintenanceId: string;
}

interface ProtectedRoutesParams {
  Maintenances: undefined;
  CreateOccasionalMaintenance: undefined;
  MaintenanceDetails: MaintenanceDetailsParams;
}

interface PublicRoutesParams {
  Login: undefined;
  ForgotPassword: undefined;
}

export type ProtectedNavigation = NativeStackNavigationProp<ProtectedRoutesParams>;
export type PublicNavigation = NativeStackNavigationProp<PublicRoutesParams>;

export type RouteList = keyof ProtectedRoutesParams | keyof PublicRoutesParams;

export declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends ProtectedRoutesParams, PublicRoutesParams {}
  }
}
