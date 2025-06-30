import { ISupplier } from "@/types/api/ISupplier";

import { getFromCacheOnError } from "../cache";

interface IGetMaintenanceHistorySupplier {
  maintenanceHistoryId: string;
}

interface ApiResponse {
  suppliers: ISupplier[];
}

export const getMaintenanceHistorySupplier = async ({
  maintenanceHistoryId,
}: IGetMaintenanceHistorySupplier): Promise<ISupplier[]> => {
  const response = await getFromCacheOnError<ApiResponse>({
    url: `/company/suppliers/selected/${maintenanceHistoryId}`,
  });

  return response ? response.suppliers : [];
};
