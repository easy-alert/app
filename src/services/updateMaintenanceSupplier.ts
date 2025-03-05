import { baseApi } from './baseApi';

interface IUpdateMaintenanceSupplier {
  maintenanceHistoryId: string;
  supplierId: string;
  userId: string;
}

export async function updateMaintenanceSupplier ({
  maintenanceHistoryId,
  supplierId,
  userId,
  }: IUpdateMaintenanceSupplier) {
  const uri = `company/suppliers/unlink-to-maintenance-history`;

  const body = {
    maintenanceHistoryId,
    supplierId,
    userId,
  };

  try {
    const response = await baseApi.post(uri, body);

    return response.data;
  } catch (error) {
    console.log("🚀 ~ error:", error)
  }
};
