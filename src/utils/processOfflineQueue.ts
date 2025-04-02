import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { createMaintenanceHistoryActivity } from "@/services/createMaintenanceHistoryActivity";
import { updateMaintenanceFinish } from "@/services/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/updateMaintenanceProgress";
import { uploadFile } from "@/services/uploadFile";

import { OFFLINE_QUEUE_KEY } from "./constants";

let isProcessing = false; // Global lock to prevent overlapping processes

export const processOfflineQueue = async () => {
  if (isProcessing) {
    return; // Exit if already processing
  }

  isProcessing = true; // Set lock to prevent overlapping processes

  try {
    const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

    while (offlineQueue.length > 0) {
      // Get and remove the first item in the queue
      const currentItem = offlineQueue.shift();

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

          await updateMaintenanceProgress({
            syndicNanoId: currentItem?.syndicNanoId,
            userId: currentItem?.userId,
            maintenanceHistoryId: currentItem?.maintenanceHistoryId,
            inProgressChange: currentItem?.inProgressChange,
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

          await updateMaintenanceFinish({
            maintenanceHistoryId: currentItem?.maintenanceHistoryId,
            userId: currentItem?.userId,
            syndicNanoId: currentItem?.syndicNanoId,
            maintenanceReport: currentItem?.maintenanceReport,
            files: filesUploaded,
            images: imagesUploaded,
          });
        }

        // Save the updated queue after successful processing
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
      } catch (error) {
        console.error("Failed to process offline queue item:", error);
        // Re-add the item to the queue if it fails
        offlineQueue.push(currentItem);
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
        break; // Exit the loop on failure to avoid endless retries
      }
    }
  } catch (error) {
    console.error("Error during offline queue processing:", error);
  } finally {
    isProcessing = false; // Release lock after processing
  }
};

export const startPeriodicQueueProcessing = () => {
  const interval = setInterval(async () => {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      await processOfflineQueue();
    }
  }, 3000); // Check every 3 seconds

  return () => clearInterval(interval); // Return a cleanup function
};
