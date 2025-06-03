export interface IUser {
  id: string;
  UserBuildingsPermissions: {
    Building: {
      id: string;
      name: string;
    };
  }[];
}
