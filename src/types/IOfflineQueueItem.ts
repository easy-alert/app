interface IOfflineQueueItemBase {
  userId: string;
  maintenanceId: string;
}

export interface IAddHistoryActivityQueueItem extends IOfflineQueueItemBase {
  type: "addHistoryActivity";
  comment: string;
  files: {
    originalName: string;
    uri: string;
    type: string;
  }[];
}

export interface ISaveProgressQueueItem extends IOfflineQueueItemBase {
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

export interface IUpdateProgressQueueItem extends IOfflineQueueItemBase {
  type: "updateProgress";
  inProgressChange: boolean;
}

export interface IFinishMaintenanceQueueItem extends IOfflineQueueItemBase {
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

export type IOfflineQueueItem =
  | IAddHistoryActivityQueueItem
  | ISaveProgressQueueItem
  | IUpdateProgressQueueItem
  | IFinishMaintenanceQueueItem;
