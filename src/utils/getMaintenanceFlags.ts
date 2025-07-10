import type { TMaintenanceStatus } from "@/types/api/TMaintenanceStatus";
import type { TMaintenanceType } from "@/types/api/TMaintenanceType";

interface IGetMaintenanceFlagsProps {
  maintenanceStatus?: TMaintenanceStatus;
  maintenanceType?: TMaintenanceType;
  maintenanceInProgress?: boolean;
  maintenanceDate?: string | Date;
  canReport?: boolean;
  canReportExpired?: boolean;
}

export function getMaintenanceFlags({
  maintenanceStatus,
  maintenanceType,
  maintenanceInProgress,
  maintenanceDate,
  canReport,
  canReportExpired,
}: IGetMaintenanceFlagsProps) {
  const isPending = maintenanceStatus === "pending";
  const isExpired = maintenanceStatus === "expired";
  const isCompleted = maintenanceStatus === "completed";
  const isOverdue = maintenanceStatus === "overdue";

  const inProgress = maintenanceInProgress;

  const isOldExpired = isExpired && canReportExpired;
  const isFuture =
    maintenanceDate !== undefined ? new Date(maintenanceDate) > new Date(new Date().setHours(0, 0, 0, 0)) : false;

  const showExpiredOccasional = maintenanceType === "occasional" && isExpired;

  return {
    isPending,
    isExpired,
    isCompleted,
    isOverdue,
    inProgress,
    isOldExpired,
    isFuture,
    showExpiredOccasional,
    canReport,
    canReportExpired,
  };
}
