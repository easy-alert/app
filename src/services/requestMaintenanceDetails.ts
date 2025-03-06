import { baseApi } from './baseApi';

import type { IMaintenance } from '../types/IMaintenance';

export interface IRequestMaintenanceDetails {
  maintenanceHistoryId: string;
}

export const requestMaintenanceDetails = async ({
  maintenanceHistoryId,
}: IRequestMaintenanceDetails): Promise<{
  maintenanceDetails: IMaintenance;
}> => {
  const uri = `/maintenances/list/details/${maintenanceHistoryId}`;

  try {
    const response = await baseApi.get(uri);

    return response.data;
  } catch (error: any) {
    console.log("🚀 ~ error:", error)
    return { maintenanceDetails: {} as IMaintenance };
  }
};
