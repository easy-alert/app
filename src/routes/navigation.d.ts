import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { ISelectCompany } from "@/types/api/ISelectCompany";

export interface MaintenanceDetailsParams {
  maintenanceId: string;
}

interface ProtectedRoutesParams {
  Maintenances: undefined;
  CreateOccasionalMaintenance: undefined;
  MaintenanceDetails: MaintenanceDetailsParams;
}

interface PublicRoutesParams {
  Login?: {
    companyId?: string;
    login?: string;
    password?: string;
  };
  LoginCompanySelection: {
    companies: ISelectCompany[];
    login: string;
    password: string;
  };
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
