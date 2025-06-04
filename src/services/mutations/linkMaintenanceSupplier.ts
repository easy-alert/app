import type { ApiError } from "@/types/utils/ApiError";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "../baseApi";

interface ILinkMaintenanceSupplier {
  maintenanceId: string;
  supplierId: string;
  userId: string;
}

export const linkMaintenanceSupplier = async ({
  maintenanceId,
  supplierId,
  userId,
}: ILinkMaintenanceSupplier): Promise<void> => {
  try {
    const body = {
      maintenanceHistoryId: maintenanceId,
      supplierId,
      userId,
    };

    const response = await baseApi.post("/company/suppliers/link-to-maintenance-history", body);

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
