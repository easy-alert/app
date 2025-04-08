interface IOfflineQueueItemBase {
  userId: string;
  maintenanceId: string;
  timestamp: string;
  files: {
    originalName: string;
    uri: string;
    type: string;
  }[];
}

export interface IAddHistoryActivityQueueItem extends IOfflineQueueItemBase {
  type: "addHistoryActivity";
  comment: string;
}

export interface ISaveProgressQueueItem extends IOfflineQueueItemBase {
  type: "saveProgress";
  cost: number;
  images: {
    originalName: string;
    uri: string;
    type: string;
  }[];
}

export interface IFinishMaintenanceQueueItem extends IOfflineQueueItemBase {
  type: "finishMaintenance";
  cost: number;
  images: {
    originalName: string;
    uri: string;
    type: string;
  }[];
}

export type IOfflineQueueItem = IAddHistoryActivityQueueItem | ISaveProgressQueueItem | IFinishMaintenanceQueueItem;
