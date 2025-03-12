import type { IPermission } from "./IPermission";

export interface IUser {
  id: string;

  name: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  image?: string;
  role?: string;

  Permissions: {
    Permission: IPermission;
    id: string;
    permissionId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  }[];

  UserBuildingsPermissions: {
    Building: {
      id: string;
      nanoId: string;
      name: string;
    };
  }[];

  isBlocked: boolean;

  lastAccess: string;
  createdAt: string;
  updatedAt: string;
}
