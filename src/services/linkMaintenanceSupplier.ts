import { baseApi } from "./baseApi";

import { alertMessage, catchHandler } from "../utils/handleAlerts";

import type { IError } from "../types/IError";

interface ILinkMaintenanceSupplier {
  maintenanceId: string;
  supplierId: string;
  userId: string;
}

export const linkMaintenanceSupplier = async ({ maintenanceId, supplierId, userId }: ILinkMaintenanceSupplier) => {
  const uri = `company/suppliers/link-to-maintenance-history`;

  const body = {
    maintenanceHistoryId: maintenanceId,
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
