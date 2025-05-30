interface OfflineQueueItemBase {
  userId: string;
  maintenanceId: string;
}

export interface AddHistoryActivityQueueItem extends OfflineQueueItemBase {
  type: "addHistoryActivity";
  comment: string;
  files: {
    originalName: string;
    uri: string;
    type: string;
  }[];
}

export interface SaveProgressQueueItem extends OfflineQueueItemBase {
  type: "saveProgress";
  cost: number;
  files: {
    originalName: string;
    uri: string;
    type: string;
  }[];
  images: {
    originalName: string;
    uri: string;
    type: string;
  }[];
}

export interface UpdateProgressQueueItem extends OfflineQueueItemBase {
  type: "updateProgress";
  inProgressChange: boolean;
}

export interface FinishMaintenanceQueueItem extends OfflineQueueItemBase {
  type: "finishMaintenance";
  cost: number;
  files: {
    originalName: string;
    uri: string;
    type: string;
  }[];
  images: {
    originalName: string;
    uri: string;
    type: string;
  }[];
}

export type OfflineQueueItem =
  | AddHistoryActivityQueueItem
  | SaveProgressQueueItem
  | UpdateProgressQueueItem
  | FinishMaintenanceQueueItem;
