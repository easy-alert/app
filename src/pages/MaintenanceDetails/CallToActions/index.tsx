import { View, Text, TouchableOpacity, Alert } from "react-native";

import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { styles } from "./styles";

import { convertCostToInteger } from "../utils/convertCostToInteger";
import { OFFLINE_QUEUE_KEY } from "../utils/constants";

import type { IAnnexesAndImages } from "@/types/IAnnexesAndImages";
import type { IMaintenance } from "@/types/IMaintenance";
import type { Navigation } from "@/routes/navigation";
import type { IFile } from "@/types/IFile";

import { updateMaintenance } from "@/services/updateMaintenance";
import { updateMaintenanceFinish } from "@/services/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/updateMaintenanceProgress";
import { uploadFile } from "@/services/uploadFile";
import { useAuth } from "@/contexts/AuthContext";

interface CallToActionsProps {
  maintenanceDetails: IMaintenance;
  files: IFile[];
  images: IFile[];
  cost: string;
  setFiles: (files: IFile[]) => void;
  setImages: (images: IFile[]) => void;
  setCost: (cost: string) => void;
  setLoading: (loading: boolean) => void;
}

export const CallToActions = ({
  maintenanceDetails,
  files,
  images,
  cost,
  setFiles,
  setImages,
  setCost,
  setLoading,
}: CallToActionsProps) => {
  const navigation = useNavigation<Navigation>();
  const { userId } = useAuth();

  const handleChangeMaintenanceProgress = async () => {
    setLoading(true);

    try {
      await updateMaintenanceProgress({
        maintenanceHistoryId: maintenanceDetails.id,
        inProgressChange: !maintenanceDetails.inProgress,
        syndicNanoId: "",
        userId,
      });
    } finally {
      navigation.goBack();
      setLoading(false);
    }
  };

  const handleSaveMaintenanceProgress = async () => {
    setLoading(true);

    const formatedCost = convertCostToInteger(cost);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    const filesUploaded = [] as IAnnexesAndImages[];
    const imagesUploaded = [] as IAnnexesAndImages[];

    try {
      if (isConnected) {
        // Handle file uploads when online
        if (files?.length > 0) {
          for (const file of files) {
            const fileUrl = file.type
              ? await uploadFile({
                  uri: file.url,
                  type: file.type,
                  name: file.originalName,
                })
              : file.url;

            filesUploaded.push({
              originalName: file.originalName,
              url: fileUrl,
              name: file.originalName,
            });
          }
        }

        if (images?.length > 0) {
          for (const image of images) {
            const fileUrl = image.type
              ? await uploadFile({
                  uri: image.url,
                  type: image.type,
                  name: image.originalName,
                })
              : image.url;

            imagesUploaded.push({
              originalName: image.originalName,
              url: fileUrl,
              name: image.originalName,
            });
          }
        }

        // If online, send data to the server
        await updateMaintenance({
          maintenanceHistoryId: maintenanceDetails.id,
          syndicNanoId: "",
          userId,
          maintenanceReport: {
            cost: formatedCost,
            observation: "",
          },
          files: filesUploaded,
          images: imagesUploaded,
        });

        setFiles([]);
        setImages([]);
        setCost("");
        navigation.goBack();
      } else {
        // If offline, save data to a queue in AsyncStorage
        const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

        // Include file and image metadata instead of uploading
        const filesToQueue = files.map((file) => ({
          originalName: file.originalName,
          uri: file.url,
          type: file.type,
        }));

        const imagesToQueue = images.map((image) => ({
          originalName: image.originalName,
          uri: image.url,
          type: image.type,
        }));

        const newEntry = {
          type: "saveProgress",
          userId,
          maintenanceId: maintenanceDetails.id,
          cost: formatedCost,
          files: filesToQueue,
          images: imagesToQueue,
          timestamp: new Date().toISOString(),
        };

        offlineQueue.push(newEntry);
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));

        setFiles([]);
        setImages([]);
        setCost("");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error in saveProgress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishMaintenance = async () => {
    setLoading(true);

    const formatedCost = convertCostToInteger(cost);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    const filesUploaded = [];
    const imagesUploaded = [];

    try {
      if (isConnected) {
        // Handle file uploads when online
        if (files?.length > 0) {
          for (const file of files) {
            const fileUrl = file.type
              ? await uploadFile({
                  uri: file.url,
                  type: file.type,
                  name: file.originalName,
                })
              : file.url;

            filesUploaded.push({
              originalName: file.originalName,
              url: fileUrl,
              name: file.originalName,
            });
          }
        }

        if (images?.length > 0) {
          for (const image of images) {
            const fileUrl = image.type
              ? await uploadFile({
                  uri: image.url,
                  type: image.type,
                  name: image.originalName,
                })
              : image.url;

            imagesUploaded.push({
              originalName: image.originalName,
              url: fileUrl,
              name: image.originalName,
            });
          }
        }

        // If online, send data to the server
        await updateMaintenanceFinish({
          maintenanceHistoryId: maintenanceDetails.id,
          syndicNanoId: "",
          userId,
          maintenanceReport: {
            cost: formatedCost,
            observation: "",
          },
          files: filesUploaded,
          images: imagesUploaded,
        });

        setFiles([]);
        setImages([]);
        setCost("");
        navigation.goBack();
      } else {
        // If offline, save data to a queue in AsyncStorage
        const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

        // Include file and image metadata instead of uploading
        const filesToQueue = files.map((file) => ({
          originalName: file.originalName,
          uri: file.url,
          type: file.type,
        }));

        const imagesToQueue = images.map((image) => ({
          originalName: image.originalName,
          uri: image.url,
          type: image.type,
        }));

        const newEntry = {
          type: "finishMaintenance",
          userId,
          maintenanceId: maintenanceDetails.id,
          cost: formatedCost,
          files: filesToQueue,
          images: imagesToQueue,
          timestamp: new Date().toISOString(),
        };

        offlineQueue.push(newEntry);
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));

        setFiles([]);
        setImages([]);
        setCost("");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error in handleFinishMaintenance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {maintenanceDetails.MaintenancesStatus.name !== "completed" &&
        maintenanceDetails.MaintenancesStatus.name !== "overdue" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.secondaryActionButton} onPress={handleChangeMaintenanceProgress}>
              <Text style={styles.secondaryActionButtonText}>
                {maintenanceDetails.inProgress ? "Parar" : "Iniciar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryActionButton} onPress={handleSaveMaintenanceProgress}>
              <Text style={styles.secondaryActionButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => {
                if (maintenanceDetails.id) {
                  Alert.alert("Confirmar Ação", "Tem certeza de que deseja finalizar a manutenção?", [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Sim",
                      onPress: handleFinishMaintenance,
                    },
                  ]);
                }
              }}
            >
              <Text style={styles.actionButtonText}>Finalizar manutenção</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
};
