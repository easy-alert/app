import { IMaintenanceSuppliers } from "@/types/api/IMaintenanceSuppliers";

import { getFromCacheOnError } from "../cache";

interface IGetSuppliersForMaintenance {
  maintenanceId: string;
}

export const getSuppliersForMaintenance = ({
  maintenanceId,
}: IGetSuppliersForMaintenance): Promise<IMaintenanceSuppliers | null> => {
  return getFromCacheOnError<IMaintenanceSuppliers>({ url: `/company/suppliers/to-select/${maintenanceId}` });
};
