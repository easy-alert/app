import type { ICategory } from "@/types/api/ICategory";

import { getFromCacheOnError } from "../cache";

interface ApiResponse {
  Categories: ICategory[];
}

export const getCategories = async (): Promise<ICategory[]> => {
  const response = await getFromCacheOnError<ApiResponse>({
    url: "/company/buildings/maintenances/occasional/auxiliarydata",
  });

  return response ? response.Categories : [];
};
