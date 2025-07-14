import type { IUserBuildingPermission } from "./IUserBuildingPermission";
import type { IUserPermission } from "./IUserPermission";

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isBlocked: boolean;
  isCompanyOwner: boolean;
  Permissions: { Permission: IUserPermission }[];
  UserBuildingsPermissions: IUserBuildingPermission[];
}
