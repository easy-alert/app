import { baseApi } from "./baseApi";

import type { IError } from "@/types/IError";

import { alertMessage, catchHandler } from "@/utils/handleAlerts";

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
    const response = error.response as IError;

    catchHandler({
      message: response?.data?.ServerMessage?.message,
      statusCode: response?.status,
    });
  }
};
