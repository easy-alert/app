import AsyncStorage from "@react-native-async-storage/async-storage";

import { createMaintenanceHistoryActivity } from "@/services/mutations/createMaintenanceHistoryActivity";
import { updateMaintenance } from "@/services/mutations/updateMaintenance";
import { updateMaintenanceFinish } from "@/services/mutations/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/mutations/updateMaintenanceProgress";
import { uploadFile } from "@/services/mutations/uploadFile";

import { IRemoteFile } from "@/types/api/IRemoteFile";
import type {
  AddHistoryActivityQueueItem,
  FinishMaintenanceQueueItem,
  OfflineQueueItem,
  SaveProgressQueueItem,
  UpdateProgressQueueItem,
} from "@/types/utils/OfflineQueueItem";

import { retry } from "./retry";
import { storageKeys } from "./storageKeys";

let isSyncing = false;

export const getOfflineQueue = async (): Promise<OfflineQueueItem[]> => {
  const offlineQueueString = await AsyncStorage.getItem(storageKeys.OFFLINE_QUEUE_KEY);
  return offlineQueueString ? JSON.parse(offlineQueueString) : [];
};

export const addItemToOfflineQueue = async (item: OfflineQueueItem): Promise<void> => {
  const offlineQueue = await getOfflineQueue();
  offlineQueue.push(item);
  await AsyncStorage.setItem(storageKeys.OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
};

export const syncOfflineQueue = async (): Promise<void> => {
  if (isSyncing) {
    return;
  }

  try {
    isSyncing = true;

    const offlineQueue = await getOfflineQueue();

    while (offlineQueue.length > 0) {
      const currentItem = offlineQueue.shift()!;

      try {
        await retry(async () => {
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
        });

        await AsyncStorage.setItem(storageKeys.OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
      } catch (error) {
        console.error("Failed to sync offline queue item:", error);
        offlineQueue.push(currentItem);
        await AsyncStorage.setItem(storageKeys.OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
        break;
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

  const uploadPromises = item.localFiles.map(async (file) => {
    const { success, data } = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.name,
    });

    if (!success) {
      return;
    }

    filesUploaded.push({
      name: file.name,
      url: data.url,
    });
  });

  await Promise.all(uploadPromises);

  // TODO: verificar quando da erro
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

  const uploadFilesPromises = item.localFiles.map(async (file) => {
    const { success, data } = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.name,
    });

    if (!success) {
      return;
    }

    filesUploaded.push({
      name: file.name,
      url: data.url,
    });
  });

  const imagesUploaded: IRemoteFile[] = [];

  const uploadImagesPromises = item.localImages.map(async (image) => {
    const { success, data } = await uploadFile({
      uri: image.uri,
      type: image.type,
      name: image.name,
    });

    if (!success) {
      return;
    }

    imagesUploaded.push({
      name: image.name,
      url: data.url,
    });
  });

  await Promise.all([...uploadFilesPromises, ...uploadImagesPromises]);

  // TODO: verificar quando da erro
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
  // TODO: verificar quando da erro
  await updateMaintenanceProgress({
    maintenanceHistoryId: item.maintenanceId,
    inProgressChange: item.inProgressChange,
    syndicNanoId: "",
    userId: item.userId,
  });
};

const syncFinishMaintenance = async (item: FinishMaintenanceQueueItem): Promise<void> => {
  const filesUploaded: IRemoteFile[] = [];

  const uploadFilesPromises = item.localFiles.map(async (file) => {
    const { success, data } = await uploadFile({
      uri: file.uri,
      type: file.type,
      name: file.name,
    });

    if (!success) {
      return;
    }

    filesUploaded.push({
      name: file.name,
      url: data.url,
    });
  });

  const imagesUploaded: IRemoteFile[] = [];

  const uploadImagesPromises = item.localImages.map(async (image) => {
    const { success, data } = await uploadFile({
      uri: image.uri,
      type: image.type,
      name: image.name,
    });

    if (!success) {
      return;
    }

    imagesUploaded.push({
      name: image.name,
      url: data.url,
    });
  });

  await Promise.all([...uploadFilesPromises, ...uploadImagesPromises]);

  // TODO: verificar quando da erro
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
