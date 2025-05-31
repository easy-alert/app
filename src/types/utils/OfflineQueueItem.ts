import { IRemoteFile } from "../api/IRemoteFile";
import { LocalFile } from "./LocalFile";

interface OfflineQueueItemBase {
  userId: string;
  maintenanceId: string;
}

export interface AddHistoryActivityQueueItem extends OfflineQueueItemBase {
  type: "addHistoryActivity";
  comment: string;
  localFiles: LocalFile[];
}

export interface SaveProgressQueueItem extends OfflineQueueItemBase {
  type: "saveProgress";
  cost: number;
  localFiles: LocalFile[];
  localImages: LocalFile[];
  remoteFiles: IRemoteFile[];
  remoteImages: IRemoteFile[];
}

export interface UpdateProgressQueueItem extends OfflineQueueItemBase {
  type: "updateProgress";
  inProgressChange: boolean;
}

export interface FinishMaintenanceQueueItem extends OfflineQueueItemBase {
  type: "finishMaintenance";
  cost: number;
  localFiles: LocalFile[];
  localImages: LocalFile[];
  remoteFiles: IRemoteFile[];
  remoteImages: IRemoteFile[];
}

export type OfflineQueueItem =
  | AddHistoryActivityQueueItem
  | SaveProgressQueueItem
  | UpdateProgressQueueItem
  | FinishMaintenanceQueueItem;
