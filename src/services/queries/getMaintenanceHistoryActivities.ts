import { IMaintenanceHistoryActivities } from "@/types/api/IMaintenanceHistoryActivities";

import { getFromCacheOnError } from "../cache";

interface IGetMaintenanceHistoryActivities {
  maintenanceHistoryId: string;
}

export const getMaintenanceHistoryActivities = ({
  maintenanceHistoryId,
}: IGetMaintenanceHistoryActivities): Promise<IMaintenanceHistoryActivities | null> => {
  return getFromCacheOnError<IMaintenanceHistoryActivities>({
    url: `/company/maintenance-history-activities/${maintenanceHistoryId}`,
  });
};
