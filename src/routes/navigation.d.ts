import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export interface CreateOccasionalMaintenanceProps {
  buildingId: string;
  userId: string;
}

export interface MaintenanceDetailsProps {
  maintenanceId: string;
  userId: string;
}

interface RootStackParamList {
  Splash: undefined;
  Login: undefined;
  Building: undefined;
  Board: undefined;
  CreateOccasionalMaintenance: CreateOccasionalMaintenanceProps;
  MaintenanceDetails: MaintenanceDetailsProps;
}

export type Navigation = NativeStackNavigationProp<RootStackParamList>;

export declare global {
  namespace ReactNavigation {
    type RootParamList = RootStackParamList;
  }
}
