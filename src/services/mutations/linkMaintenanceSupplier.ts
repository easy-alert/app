import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";
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
}: ILinkMaintenanceSupplier): Promise<MutationResponse> => {
  try {
    const body = {
      maintenanceHistoryId: maintenanceId,
      supplierId,
      userId,
    };

    const response = await baseApi.post<ApiMutationResponse>("/company/suppliers/link-to-maintenance-history", body);

    alertMessage({
      type: "success",
      message: response.data.ServerMessage.message,
    });

    return { success: true };
  } catch (error: any) {
    const response = error.response as ApiMutationError;

    catchHandler({
      message: response.data.ServerMessage.message,
    });

    return { success: false };
  }
};
