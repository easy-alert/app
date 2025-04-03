import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { createMaintenanceHistoryActivity } from "@/services/createMaintenanceHistoryActivity";
import { updateMaintenanceFinish } from "@/services/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/updateMaintenanceProgress";
import { uploadFile } from "@/services/uploadFile";

import type { IOfflineQueueItem } from "@/types/IOfflineQueueItem";

const OFFLINE_QUEUE_KEY = "offline_queue";

let isSyncing = false; // Global lock to prevent overlapping sync

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
    return; // Exit if already syncing
  }

  isSyncing = true; // Set lock to prevent overlapping sync

  try {
    const offlineQueue = await getOfflineQueue();

    while (offlineQueue.length > 0) {
      // Get and remove the first item in the queue
      const currentItem = offlineQueue.shift()!;

      try {
        if (currentItem.type === "addHistoryActivity") {
          // Handle addHistoryActivity
          const filesUploaded = [];
          for (const file of currentItem.files) {
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
            maintenanceId: currentItem?.maintenanceId,
            userId: currentItem?.userId,
            content: currentItem?.comment,
            uploadedFile: filesUploaded,
          });
        } else if (currentItem.type === "saveProgress") {
          // Handle saveProgress
          const filesUploaded = [];
          for (const file of currentItem.files) {
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
          for (const image of currentItem.images) {
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

          // TODO: fix, this is not working
          await updateMaintenanceProgress({
            // @ts-expect-error not working
            syndicNanoId: currentItem.syndicNanoId,
            userId: currentItem.userId,
            // @ts-expect-error not working
            maintenanceHistoryId: currentItem.maintenanceHistoryId,
            // @ts-expect-error not working
            inProgressChange: currentItem.inProgressChange,
          });
        } else if (currentItem.type === "finishMaintenance") {
          // Handle finishMaintenance
          const filesUploaded = [];
          for (const file of currentItem.files) {
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
          for (const image of currentItem.images) {
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

          // TODO: fix, this is not working
          await updateMaintenanceFinish({
            // @ts-expect-error not working
            maintenanceHistoryId: currentItem.maintenanceHistoryId,
            userId: currentItem.userId,
            // @ts-expect-error not working
            syndicNanoId: currentItem.syndicNanoId,
            // @ts-expect-error not working
            maintenanceReport: currentItem.maintenanceReport,
            files: filesUploaded,
            images: imagesUploaded,
          });
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
    isSyncing = false; // Release lock after sync
  }
};

export const startPeriodicQueueSync = () => {
  const interval = setInterval(async () => {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      await syncOfflineQueue();
    }
  }, 3000); // Check every 3 seconds

  return () => clearInterval(interval); // Return a cleanup function
};
