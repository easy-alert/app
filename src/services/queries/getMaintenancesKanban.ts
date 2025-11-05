import { IMaintenancesKanban } from "@/types/api/IMaintenancesKanban";

import { getFromCacheOnError } from "../cache";

interface IGetMaintenancesKanban {
  userId: string;
  filters: {
    buildings?: string[];
    status?: string[];
    categories?: string[];
    users?: string[];
    priorityNames?: string[];
    types?: string[];
    search?: string;
    startDate: string;
    endDate: string;
  };
}

export const getMaintenancesKanban = ({
  userId,
  filters,
}: IGetMaintenancesKanban): Promise<IMaintenancesKanban | null> => {
  const params = {
    userId,
    buildingId: filters.buildings?.join(",") || "",
    status: filters.status?.join(",") || "",
    category: filters.categories?.join(",") || "",
    user: filters.users?.join(",") || "",
    priorityName: filters.priorityNames?.join(",") || "",
    type: filters.types?.join(",") || "",
    search: filters.search || "",
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  const url = "/company/maintenances/kanban";
  const cacheKey = `${url}?${new URLSearchParams(params as any).toString()}`;

  return getFromCacheOnError<IMaintenancesKanban>({
    url,
    cacheKey,
    config: {
      params,
    },
  });
};
