import { baseApi } from './baseApi';

export interface IGetMaintenanceDetails {
  maintenanceHistoryId: string;
}


export const getMaintenanceDetails = async ({
  maintenanceHistoryId,
}: IGetMaintenanceDetails) => {
  const uri = `company/maintenances/list/details/${maintenanceHistoryId}`;
  
  try {
    const response = await baseApi.get(uri);

    return response.data;
  } catch (error: any) {
    return {};
  }
};
