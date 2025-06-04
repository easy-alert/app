import type { ApiError } from "@/types/utils/ApiError";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "./baseApi";

interface IUnlinkMaintenanceSupplier {
  maintenanceHistoryId: string;
  supplierId: string;
  userId: string;
}

export const unlinkMaintenanceSupplier = async ({
  maintenanceHistoryId,
  supplierId,
  userId,
}: IUnlinkMaintenanceSupplier): Promise<void> => {
  try {
    const body = {
      maintenanceHistoryId,
      supplierId,
      userId,
    };

    const response = await baseApi.post("/company/suppliers/unlink-to-maintenance-history", body);

    alertMessage({
      type: "success",
      message: response?.data?.ServerMessage?.message,
    });
  } catch (error: any) {
    const response = error.response as ApiError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
    });
  }
};
