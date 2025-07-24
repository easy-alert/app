import type { ApiMutationError } from "@/types/utils/ApiMutationError";
import type { ApiMutationResponse } from "@/types/utils/ApiMutationResponse";
import type { MutationResponse } from "@/types/utils/MutationResponse";

import { baseApi } from "../baseApi";

interface IUpdateMaintenanceReport {
  maintenanceHistoryId: string;
  maintenanceReport: {
    id: string;
    cost: number;
    observation?: string;
  };
  files: {
    originalName: string;
    name: string;
    url: string;
  }[];
  images: {
    originalName: string;
    name: string;
    url: string;
  }[];
}

export const updateMaintenanceReport = async ({
  maintenanceHistoryId,
  maintenanceReport,
  files,
  images,
}: IUpdateMaintenanceReport): Promise<MutationResponse> => {
  try {
    if (!maintenanceReport.id) {
      throw new Error("Relatório de manutenção não encontrado.");
    }

    const body = {
      maintenanceHistoryId,
      maintenanceReportId: maintenanceReport.id,
      cost: maintenanceReport.cost,
      observation: maintenanceReport.observation !== "" ? maintenanceReport.observation : null,
      ReportAnnexes: files,
      ReportImages: images,
    };

    const response = await baseApi.post<ApiMutationResponse>("/company/maintenances/edit/report", body);

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
