import type { IBuilding } from "./IBuilding";

export interface IAuthUser {
  id: string;
  UserBuildingsPermissions: {
    Building: IBuilding;
  }[];
}
