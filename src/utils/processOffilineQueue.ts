import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadFile } from "../services/uploadFile";
import { addMaintenanceHistoryActivity } from "../services/addMaintenanceHistoryActivity";
import NetInfo from "@react-native-community/netinfo";
import { saveProgressInMaintenance } from "../services/saveProgressInMaintenance";
import { finishMaintenance } from "../services/finishMaintenance";

const OFFLINE_QUEUE_KEY = "offline_queue";
let isProcessing = false; // Global lock to prevent overlapping processes

const processOfflineQueue = async () => {
  if (isProcessing) {
    // console.log("Queue processing is already running. Skipping this cycle.");
    return; // Exit if already processing
  }

  isProcessing = true; // Set lock to prevent overlapping processes

  try {
    const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    let offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

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

          await addMaintenanceHistoryActivity(
            currentItem.maintenanceId,
            currentItem.syndicNanoId,
            currentItem.comment,
            filesUploaded
          );
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

          await saveProgressInMaintenance(
            currentItem.maintenanceId,
            currentItem.cost,
            currentItem.syndicNanoId,
            filesUploaded,
            imagesUploaded
          );
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

          await finishMaintenance(
            currentItem.maintenanceId,
            currentItem.cost,
            currentItem.syndicNanoId,
            filesUploaded,
            imagesUploaded
          );
        }

        // Save the updated queue after successful processing
        await AsyncStorage.setItem(
          OFFLINE_QUEUE_KEY,
          JSON.stringify(offlineQueue)
        );
      } catch (error) {
        console.error("Failed to process offline queue item:", error);
        // Re-add the item to the queue if it fails
        offlineQueue.push(currentItem);
        await AsyncStorage.setItem(
          OFFLINE_QUEUE_KEY,
          JSON.stringify(offlineQueue)
        );
        break; // Exit the loop on failure to avoid endless retries
      }
    }
  } catch (error) {
    console.error("Error during offline queue processing:", error);
  } finally {
    isProcessing = false; // Release lock after processing
  }
};

const startPeriodicQueueProcessing = () => {
  const interval = setInterval(async () => {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      // console.log("Internet is available. Processing offline queue...");
      await processOfflineQueue();
    }
  }, 3000); // Check every 3 seconds

  return () => clearInterval(interval); // Return a cleanup function
};

export { processOfflineQueue, startPeriodicQueueProcessing };
