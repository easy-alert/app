import { IUsers } from "@/types/api/IUsers";

import { getFromCacheOnError } from "../cache";

interface IGetUsers {
  buildingId: string;
}

export const getUsers = (props?: IGetUsers): Promise<IUsers | null> => {
  const params = {
    buildingId: props?.buildingId || "",
    checkPerms: false,
  };

  const url = "/company/list/users";
  const cacheKey = `${url}?${new URLSearchParams(params as any).toString()}`;

  return getFromCacheOnError<IUsers>({
    url,
    cacheKey,
    config: {
      params,
    },
  });
};
