import { IListUser } from "@/types/utils/IListUser";

import { getFromCacheOnError } from "../cache";

interface IGetUsers {
  buildingId: string;
}

interface IGetUsersResponse {
  users: IListUser[];
}

export const getUsers = (props?: IGetUsers): Promise<IGetUsersResponse | null> => {
  const params = {
    buildingId: props?.buildingId || "",
    checkPerms: false,
  };

  const url = "/company/list/users";
  const cacheKey = `${url}?${new URLSearchParams(params as any).toString()}`;

  return getFromCacheOnError<IGetUsersResponse>({
    url,
    cacheKey,
    config: {
      params,
    },
  });
};
