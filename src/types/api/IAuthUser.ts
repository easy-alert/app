import type { IPushNotification } from "./IPushNotification";
import type { IUserBuildingPermission } from "./IUserBuildingPermission";
import type { IUserPermission } from "./IUserPermission";

export interface IAuthUser {
  id: string;

  name: string;
  email: string;
  emailIsConfirmed: boolean;
  phoneNumber: string;
  phoneNumberIsConfirmed: boolean;

  role: string;
  image: string;
  colorScheme: string;

  isBlocked: boolean;
  isCompanyOwner: boolean;

  PushNotification: IPushNotification[];
  Permissions: { Permission: IUserPermission }[];
  UserBuildingsPermissions: IUserBuildingPermission[];

  lastAccess: string;
  createdAt: string;
}
