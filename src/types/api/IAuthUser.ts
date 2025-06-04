export interface IAuthUser {
  id: string;
  UserBuildingsPermissions: {
    Building: {
      id: string;
      name: string;
    };
  }[];
}
