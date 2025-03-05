import { baseApi } from './baseApi';

interface IGetMaintenanceHistoryActivities {
  maintenanceHistoryId: string;
}

export async function getMaintenanceHistoryActivities({
  maintenanceHistoryId 
}: IGetMaintenanceHistoryActivities) {
  const uri= `company/maintenance-history-activities/${maintenanceHistoryId}` 

  try {
    const response = await baseApi.get(uri);

    return response.data;
  } catch (error) {
    console.log("🚀 ~ error:", error)

    return {};
  }
};