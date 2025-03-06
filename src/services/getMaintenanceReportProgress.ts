import { baseApi } from './baseApi';

export interface IGetMaintenanceReportProgress {
  maintenanceHistoryId: string;
}

export const getMaintenanceReportProgress = async ({ maintenanceHistoryId }: IGetMaintenanceReportProgress) => {
  const uri = `company/maintenances/list/report/progress/${maintenanceHistoryId}`;

  try {
    const response = await baseApi.get(uri);

    return response.data;
  } catch (error: any) {
    console.log("🚀 ~ getMaintenanceReportProgress ~ error:", error)
    return {};
  }
};