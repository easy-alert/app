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
}: IUnlinkMaintenanceSupplier) => {
  const uri = `company/suppliers/unlink-to-maintenance-history`;

  const body = {
    maintenanceHistoryId,
    supplierId,
    userId,
  };

  try {
    const response = await baseApi.post(uri, body);

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
