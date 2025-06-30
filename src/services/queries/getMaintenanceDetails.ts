import { IMaintenance } from "@/types/api/IMaintenance";

import { getFromCacheOnError } from "../cache";

interface IGetMaintenanceDetails {
  maintenanceHistoryId: string;
}

export const getMaintenanceDetails = ({
  maintenanceHistoryId,
}: IGetMaintenanceDetails): Promise<IMaintenance | null> => {
  return getFromCacheOnError<IMaintenance>({ url: `/company/maintenances/list/details/${maintenanceHistoryId}` });
};
