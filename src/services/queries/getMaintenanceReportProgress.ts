import { IMaintenanceReportProgress } from "@/types/api/IMaintenanceReportProgress";

import { getFromCacheOnError } from "../cache";

interface IGetMaintenanceReportProgress {
  maintenanceHistoryId: string;
}

export const getMaintenanceReportProgress = ({
  maintenanceHistoryId,
}: IGetMaintenanceReportProgress): Promise<IMaintenanceReportProgress | null> => {
  return getFromCacheOnError<IMaintenanceReportProgress>({
    url: `/company/maintenances/list/report/progress/${maintenanceHistoryId}`,
  });
};
