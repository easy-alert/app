import { View, Text, TouchableOpacity, Alert } from "react-native";

import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { styles } from "./styles";

import { convertCostToInteger } from "../utils/convertCostToInteger";

import type { IAnnexesAndImages } from "@/types/IAnnexesAndImages";
import type { IMaintenance } from "@/types/IMaintenance";
import type { Navigation } from "@/routes/navigation";

import { updateMaintenance } from "@/services/updateMaintenance";
import { updateMaintenanceFinish } from "@/services/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/updateMaintenanceProgress";
import { uploadFile } from "@/services/uploadFile";
import { useAuth } from "@/contexts/AuthContext";

interface CallToActionsProps {
  maintenanceId: string;
  maintenanceDetailsData?: IMaintenance;
  OFFLINE_QUEUE_KEY: string;
  files: { originalName: string; url: string; name: string }[];
  images: { originalName: string; url: string; name: string }[];
  cost: string;
  setFiles: (files: { originalName: string; url: string; name: string }[]) => void;
  setImages: (images: { originalName: string; url: string; name: string }[]) => void;
  setCost: (cost: string) => void;
  setLoading: (loading: boolean) => void;
}

export const CallToActions = ({
  maintenanceId,
  maintenanceDetailsData,
  OFFLINE_QUEUE_KEY,
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
        maintenanceHistoryId: maintenanceId,
        inProgressChange: !maintenanceDetailsData?.inProgress,
        syndicNanoId: "",
        userId,
      });
    } finally {
      navigation.goBack();
      setLoading(false);
    }
  };

  const handleSaveMaintenanceProgress = async (maintenanceId: string, cost: number, files: any, images: any) => {
    setLoading(true);

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
          maintenanceHistoryId: maintenanceId,
          syndicNanoId: "",
          userId,
          maintenanceReport: {
            cost: cost,
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
        const filesToQueue = files.map((file: { originalName: any; url: any; type: any }) => ({
          originalName: file.originalName,
          uri: file.url,
          type: file.type,
        }));

        const imagesToQueue = images.map((image: { originalName: any; url: any; type: any }) => ({
          originalName: image.originalName,
          uri: image.url,
          type: image.type,
        }));

        const newEntry = {
          type: "saveProgress",
          userId,
          maintenanceId,
          cost,
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

  const handleFinishMaintenance = async (maintenanceId: string, cost: number, files: any, images: any) => {
    setLoading(true);

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
          maintenanceHistoryId: maintenanceId,
          syndicNanoId: "",
          userId,
          maintenanceReport: {
            cost: cost,
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
        const filesToQueue = files.map((file: { originalName: any; url: any; type: any }) => ({
          originalName: file.originalName,
          uri: file.url,
          type: file.type,
        }));

        const imagesToQueue = images.map((image: { originalName: any; url: any; type: any }) => ({
          originalName: image.originalName,
          uri: image.url,
          type: image.type,
        }));

        const newEntry = {
          type: "finishMaintenance",
          userId,
          maintenanceId,
          cost,
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
      {maintenanceDetailsData?.MaintenancesStatus.name !== "completed" &&
        maintenanceDetailsData?.MaintenancesStatus.name !== "overdue" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.secondaryActionButton} onPress={handleChangeMaintenanceProgress}>
              <Text style={styles.secondaryActionButtonText}>
                {maintenanceDetailsData?.inProgress ? "Parar" : "Iniciar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionButton}
              onPress={() => {
                if (maintenanceDetailsData?.id) {
                  handleSaveMaintenanceProgress(maintenanceDetailsData?.id, convertCostToInteger(cost), files, images);
                }
              }}
            >
              <Text style={styles.secondaryActionButtonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => {
                if (maintenanceDetailsData?.id) {
                  Alert.alert("Confirmar Ação", "Tem certeza de que deseja finalizar a manutenção?", [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Sim",
                      onPress: () => {
                        handleFinishMaintenance(maintenanceDetailsData?.id, convertCostToInteger(cost), files, images);
                      },
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
