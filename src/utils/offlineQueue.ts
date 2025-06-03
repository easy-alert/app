import AsyncStorage from "@react-native-async-storage/async-storage";

import { createMaintenanceHistoryActivity } from "@/services/createMaintenanceHistoryActivity";
import { updateMaintenance } from "@/services/updateMaintenance";
import { updateMaintenanceFinish } from "@/services/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/updateMaintenanceProgress";
import { uploadFile } from "@/services/uploadFile";
import { IRemoteFile } from "@/types/api/IRemoteFile";
import type {
  AddHistoryActivityQueueItem,
  FinishMaintenanceQueueItem,
  OfflineQueueItem,
  SaveProgressQueueItem,
  UpdateProgressQueueItem,
} from "@/types/utils/OfflineQueueItem";

const OFFLINE_QUEUE_KEY = "offline_queue";

let isSyncing = false;

export const getOfflineQueue = async (): Promise<OfflineQueueItem[]> => {
  const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  return offlineQueueString ? JSON.parse(offlineQueueString) : [];
};

export const addItemToOfflineQueue = async (item: OfflineQueueItem): Promise<void> => {
  const offlineQueue = await getOfflineQueue();
  offlineQueue.push(item);
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
};

export const syncOfflineQueue = async (): Promise<void> => {
  try {
    if (isSyncing) {
      return;
    }

    isSyncing = true;

    const offlineQueue = await getOfflineQueue();

    while (offlineQueue.length > 0) {
      // Get and remove the first item in the queue
      const currentItem = offlineQueue.shift()!;

      try {
        switch (currentItem.type) {
          case "addHistoryActivity":
            await syncAddHistoryActivity(currentItem);
            break;
          case "saveProgress":
            await syncSaveProgress(currentItem);
            break;
          case "updateProgress":
            await syncUpdateProgress(currentItem);
            break;
          case "finishMaintenance":
            await syncFinishMaintenance(currentItem);
            break;
        }

        // Save the updated queue after successful sync
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
      } catch (error) {
        console.error("Failed to sync offline queue item:", error);
        // Re-add the item to the queue if it fails
        offlineQueue.push(currentItem);
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
        break; // Exit the loop on failure to avoid endless retries
      }
    }
  } catch (error) {
    console.error("Error during offline queue syncing:", error);
  } finally {
    isSyncing = false;
  }
};

const syncAddHistoryActivity = async (item: AddHistoryActivityQueueItem): Promise<void> => {
  const filesUploaded: IRemoteFile[] = [];

  for (const file of item.localFiles) {
    const fileUrl = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.name,
    });

    if (!fileUrl) {
      continue;
    }

    filesUploaded.push({
      name: file.name,
      url: fileUrl,
    });
  }

  await createMaintenanceHistoryActivity({
    maintenanceId: item.maintenanceId,
    userId: item.userId,
    content: item.comment,
    filesUploaded: filesUploaded.map((file) => ({
      originalName: file.name,
      name: file.name,
      url: file.url,
    })),
  });
};

const syncSaveProgress = async (item: SaveProgressQueueItem): Promise<void> => {
  const filesUploaded: IRemoteFile[] = [];

  for (const file of item.localFiles) {
    const fileUrl = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.name,
    });

    if (!fileUrl) {
      continue;
    }

    filesUploaded.push({
      name: file.name,
      url: fileUrl,
    });
  }

  const imagesUploaded: IRemoteFile[] = [];

  for (const image of item.localImages) {
    const fileUrl = await uploadFile({
      uri: image.uri,
      type: image.type,
      name: image.name,
    });

    if (!fileUrl) {
      continue;
    }

    imagesUploaded.push({
      name: image.name,
      url: fileUrl,
    });
  }

  await updateMaintenance({
    maintenanceHistoryId: item.maintenanceId,
    syndicNanoId: "",
    userId: item.userId,
    maintenanceReport: {
      cost: item.cost,
      observation: "",
    },
    files: [...filesUploaded, ...item.remoteFiles].map((file) => ({
      originalName: file.name,
      name: file.name,
      url: file.url,
    })),
    images: [...imagesUploaded, ...item.remoteImages].map((image) => ({
      originalName: image.name,
      name: image.name,
      url: image.url,
    })),
  });
};

const syncUpdateProgress = async (item: UpdateProgressQueueItem): Promise<void> => {
  await updateMaintenanceProgress({
    maintenanceHistoryId: item.maintenanceId,
    inProgressChange: item.inProgressChange,
    syndicNanoId: "",
    userId: item.userId,
  });
};

const syncFinishMaintenance = async (item: FinishMaintenanceQueueItem): Promise<void> => {
  const filesUploaded: IRemoteFile[] = [];

  for (const file of item.localFiles) {
    const fileUrl = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.name,
    });

    if (!fileUrl) {
      continue;
    }

    filesUploaded.push({
      name: file.name,
      url: fileUrl,
    });
  }

  const imagesUploaded: IRemoteFile[] = [];

  for (const image of item.localImages) {
    const fileUrl = await uploadFile({
      uri: image.uri,
      type: image.type,
      name: image.name,
    });

    if (!fileUrl) {
      continue;
    }

    imagesUploaded.push({
      name: image.name,
      url: fileUrl,
    });
  }

  await updateMaintenanceFinish({
    maintenanceHistoryId: item.maintenanceId,
    syndicNanoId: "",
    userId: item.userId,
    maintenanceReport: {
      cost: item.cost,
      observation: "",
    },
    files: [...filesUploaded, ...item.remoteFiles].map((file) => ({
      originalName: file.name,
      name: file.name,
      url: file.url,
    })),
    images: [...imagesUploaded, ...item.remoteImages].map((image) => ({
      originalName: image.name,
      name: image.name,
      url: image.url,
    })),
  });
};
