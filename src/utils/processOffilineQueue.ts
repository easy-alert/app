import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadFile } from "../services/uploadFile";
import { addMaintenanceHistoryActivity } from "../services/addMaintenanceHistoryActivity";
import NetInfo from "@react-native-community/netinfo";
import { saveProgressInMaintenance } from "../services/saveProgressInMaintenance";
import { finishMaintenance } from "../services/finishMaintenance";

const OFFLINE_QUEUE_KEY = "offline_queue";
let isProcessing = false; // Global lock to prevent overlapping processes

const processOfflineQueue = async () => {
  const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

  if (offlineQueue.length > 0) {
    const updatedQueue = [];

    for (const item of offlineQueue) {
      try {
        if (item.type === "addHistoryActivity") {
          // Handle addHistoryActivity
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

          await addMaintenanceHistoryActivity(
            item.maintenanceId,
            item.syndicNanoId,
            item.comment,
            filesUploaded
          );
        } else if (item.type === "saveProgress") {
          // Handle saveProgress
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

          await saveProgressInMaintenance(
            item.maintenanceId,
            item.cost,
            item.syndicNanoId,
            filesUploaded,
            imagesUploaded
          );
        } else if (item.type === "finishMaintenance") {
          // Handle finishMaintenance
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

          await finishMaintenance(
            item.maintenanceId,
            item.cost,
            item.syndicNanoId,
            filesUploaded,
            imagesUploaded
          );
        }
      } catch (error) {
        console.error("Failed to process offline queue item:", error);
        updatedQueue.push(item); // Re-add item to queue if processing fails
      }
    }

    // Update the queue in AsyncStorage
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));
  }
};

const startPeriodicQueueProcessing = () => {
  const interval = setInterval(async () => {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      console.log("Internet is available. Processing offline queue...");
      await processOfflineQueue();
    }
  }, 3000); // Check every 3 seconds

  return () => clearInterval(interval); // Return a cleanup function
};

export { processOfflineQueue, startPeriodicQueueProcessing };
