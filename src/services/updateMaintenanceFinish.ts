import { baseApi } from "./baseApi";

import type { IAnnexesAndImages } from "@/types/IAnnexesAndImages";
import type { IError } from "@/types/IError";
import type { IMaintenanceReportProgress } from "@/types/IMaintenanceReportProgress";

import { alertMessage, catchHandler } from "@/utils/handleAlerts";

interface IUpdateMaintenanceFinish {
  syndicNanoId: string;
  userId: string;
  maintenanceHistoryId: string;
  maintenanceReport: IMaintenanceReportProgress;
  files: IAnnexesAndImages[];
  images: IAnnexesAndImages[];
}

export const updateMaintenanceFinish = async ({
  syndicNanoId,
  userId,
  maintenanceHistoryId,
  maintenanceReport,
  files,
  images,
}: IUpdateMaintenanceFinish) => {
  const uri = `company/maintenances/create/report`;

  const body = {
    userId,
    responsibleSyndicId: syndicNanoId,
    maintenanceHistoryId,
    cost: maintenanceReport.cost,
    observation: maintenanceReport.observation !== "" ? maintenanceReport.observation : null,
    ReportAnnexes: files,
    ReportImages: images,
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
