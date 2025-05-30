import type { IAnnexesAndImages } from "@/types/api/IAnnexesAndImages";
import type { IMaintenanceReportProgress } from "@/types/api/IMaintenanceReportProgress";
import type { ApiError } from "@/types/utils/ApiError";
import { alertMessage, catchHandler } from "@/utils/alerts";

import { baseApi } from "./baseApi";

interface IUpdateMaintenance {
  syndicNanoId: string;
  userId: string;
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReportProgress;
  files: IAnnexesAndImages[];
  images: IAnnexesAndImages[];
}

export const updateMaintenance = async ({
  syndicNanoId,
  userId,
  maintenanceReport,
  maintenanceHistoryId,
  files,
  images,
}: IUpdateMaintenance) => {
  const uri = `company/maintenances/create/report/progress`;

  const params = {
    syndicNanoId,
  };

  const body = {
    userId,
    maintenanceHistoryId,
    cost: maintenanceReport.cost,
    observation: maintenanceReport.observation !== "" ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
  };

  try {
    const response = await baseApi.post(uri, body, { params });

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
