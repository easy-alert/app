import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import { MutationResponse } from "@/types/utils/MutationResponse";

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

    return {
      success: true,
      message: response.data.ServerMessage.message,
    };
  } catch (error: any) {
    const response = error.response as ApiMutationError;

    return {
      success: false,
      message: response.data.ServerMessage.message,
    };
  }
};
