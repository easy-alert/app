import type { IError } from "@/types/IError";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "./baseApi";

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
    });
  }
};
