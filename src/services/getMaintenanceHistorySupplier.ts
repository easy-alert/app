import { baseApi } from './baseApi';

interface IGetMaintenanceHistorySupplier {
  maintenanceHistoryId: string;
}

export async function getMaintenanceHistorySupplier ({
  maintenanceHistoryId
  }: IGetMaintenanceHistorySupplier) {
    const uri = `company/suppliers/selected/${maintenanceHistoryId}`;

    try {
      const response = await baseApi.get(uri);

      return response.data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
    }
};