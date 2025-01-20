import { baseApi } from "../baseApi";

import { unMaskBRL } from "../../utils/unMaskBRL";

import type {
  IOccasionalMaintenanceData,
  IOccasionalMaintenanceType,
  IResponse,
} from "../../types";

interface IRequestCreateOccasionalMaintenance {
  origin: string;
  syndicNanoId: string;
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  occasionalMaintenanceBody: IOccasionalMaintenanceData;

  ticketsIds?: string[];
}

interface IResponseCreateOccasionalMaintenance extends IResponse {
  data: {
    maintenance: {
      id: string;
    };
    ServerMessage: {
      statusCode: number;
      message: string;
    };
  };
}

export const createOccasionalMaintenance = async ({
  origin,
  syndicNanoId,
  occasionalMaintenanceType,
  occasionalMaintenanceBody: {
    buildingId,
    executionDate,
    categoryData,
    reportData,
    inProgress,
    element,
    activity,
    responsible,
    priorityName,
  },
}: IRequestCreateOccasionalMaintenance) => {
  const uri = "/client/building/reports/occasional/create";

  const body = {
    origin,
    occasionalMaintenanceType,
    buildingId: buildingId || null,
    executionDate:
      (new Date(new Date(executionDate).setUTCHours(3, 0, 0, 0))).toISOString() || null,
    responsibleSyndicId: syndicNanoId,
    priorityName: priorityName || "low",
    categoryData: {
      id: categoryData.id || null,
      name: categoryData.name || null,
    },
    maintenanceData: {
      element: element || null,
      activity: activity || null,
      responsible: responsible || null,
    },
    inProgress,
    reportData: {
      cost: unMaskBRL(reportData.cost) || null,
      observation: reportData.observation || null,
      files: reportData.files || null,
      images: reportData.images || null,
    },
  };

  console.log('body', body);
  

  try {
    const response: IResponseCreateOccasionalMaintenance = await baseApi.post(
      uri,
      body
    );

    return response.data;
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return null;
  }
};
