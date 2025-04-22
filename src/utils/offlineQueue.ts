import AsyncStorage from "@react-native-async-storage/async-storage";

import { createMaintenanceHistoryActivity } from "@/services/createMaintenanceHistoryActivity";
import { updateMaintenance } from "@/services/updateMaintenance";
import { updateMaintenanceFinish } from "@/services/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/updateMaintenanceProgress";
import { uploadFile } from "@/services/uploadFile";
import type {
  IAddHistoryActivityQueueItem,
  IFinishMaintenanceQueueItem,
  IOfflineQueueItem,
  ISaveProgressQueueItem,
  IUpdateProgressQueueItem,
} from "@/types/IOfflineQueueItem";

const OFFLINE_QUEUE_KEY = "offline_queue";

let isSyncing = false;

export const getOfflineQueue = async (): Promise<IOfflineQueueItem[]> => {
  const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  return offlineQueueString ? JSON.parse(offlineQueueString) : [];
};

export const addItemToOfflineQueue = async (item: IOfflineQueueItem) => {
  const offlineQueue = await getOfflineQueue();
  offlineQueue.push(item);
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
};

export const syncOfflineQueue = async () => {
  if (isSyncing) {
    return;
  }

  isSyncing = true;

  try {
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

const syncAddHistoryActivity = async (item: IAddHistoryActivityQueueItem) => {
  const filesUploaded = [];

  for (const file of item.files) {
    const fileUrl = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.originalName,
    });

    filesUploaded.push({
      originalName: file.originalName,
      url: fileUrl,
      type: file.type,
    });
  }

  await createMaintenanceHistoryActivity({
    maintenanceId: item.maintenanceId,
    userId: item.userId,
    content: item.comment,
    uploadedFile: filesUploaded,
  });
};

const syncSaveProgress = async (item: ISaveProgressQueueItem) => {
  const filesUploaded = [];

  for (const file of item.files) {
    const fileUrl = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.originalName,
    });

    filesUploaded.push({
      originalName: file.originalName,
      url: fileUrl,
      name: file.originalName,
    });
  }

  const imagesUploaded = [];

  for (const image of item.images) {
    const fileUrl = await uploadFile({
      uri: image.uri,
      type: image.type,
      name: image.originalName,
    });

    imagesUploaded.push({
      originalName: image.originalName,
      url: fileUrl,
      name: image.originalName,
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
    files: filesUploaded,
    images: imagesUploaded,
  });
};

const syncUpdateProgress = async (item: IUpdateProgressQueueItem) => {
  await updateMaintenanceProgress({
    maintenanceHistoryId: item.maintenanceId,
    inProgressChange: item.inProgressChange,
    syndicNanoId: "",
    userId: item.userId,
  });
};

const syncFinishMaintenance = async (item: IFinishMaintenanceQueueItem) => {
  const filesUploaded = [];

  for (const file of item.files) {
    const fileUrl = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.originalName,
    });

    filesUploaded.push({
      originalName: file.originalName,
      url: fileUrl,
      name: file.originalName,
    });
  }

  const imagesUploaded = [];
  for (const image of item.images) {
    const fileUrl = await uploadFile({
      uri: image.uri,
      type: image.type,
      name: image.originalName,
    });

    imagesUploaded.push({
      originalName: image.originalName,
      url: fileUrl,
      name: image.originalName,
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
    files: filesUploaded,
    images: imagesUploaded,
  });
};
