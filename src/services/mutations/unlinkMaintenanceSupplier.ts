import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";
import { alertCatchMessage, alertMessage } from "@/utils/alerts";

import { baseApi } from "../baseApi";

interface IUnlinkMaintenanceSupplier {
  maintenanceHistoryId: string;
  supplierId: string;
  userId: string;
}

export const unlinkMaintenanceSupplier = async ({
  maintenanceHistoryId,
  supplierId,
  userId,
}: IUnlinkMaintenanceSupplier): Promise<MutationResponse> => {
  try {
    const body = {
      maintenanceHistoryId,
      supplierId,
      userId,
    };

    const response = await baseApi.post<ApiMutationResponse>("/company/suppliers/unlink-to-maintenance-history", body);

    alertMessage({
      type: "success",
      message: response.data.ServerMessage.message,
    });

    return { success: true };
  } catch (error: any) {
    const response = error.response as ApiMutationError;

    alertCatchMessage({
      message: response.data.ServerMessage.message,
    });

    return { success: false };
  }
};
