import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { Alert, View } from "react-native";

import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import type { Navigation } from "@/routes/navigation";
import { updateMaintenance } from "@/services/updateMaintenance";
import { updateMaintenanceFinish } from "@/services/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/updateMaintenanceProgress";
import { uploadFile } from "@/services/uploadFile";
import type { IAnnexesAndImages } from "@/types/IAnnexesAndImages";
import type { ILocalFile } from "@/types/ILocalFile";
import type { IMaintenance } from "@/types/IMaintenance";
import type { IOfflineQueueItem } from "@/types/IOfflineQueueItem";
import type { IRemoteFile } from "@/types/IRemoteFile";
import { addItemToOfflineQueue } from "@/utils/offlineQueue";

import { convertCostToInteger } from "../utils/convertCostToInteger";
import { styles } from "./styles";

interface CallToActionsProps {
  maintenanceDetails: IMaintenance;
  files: (IRemoteFile | ILocalFile)[];
  images: (IRemoteFile | ILocalFile)[];
  cost: string;
  setFiles: (files: (IRemoteFile | ILocalFile)[]) => void;
  setImages: (images: (IRemoteFile | ILocalFile)[]) => void;
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

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    try {
      if (isConnected) {
        await updateMaintenanceProgress({
          maintenanceHistoryId: maintenanceDetails.id,
          inProgressChange: !maintenanceDetails.inProgress,
          syndicNanoId: "",
          userId,
        });
      } else {
        const newEntry: IOfflineQueueItem = {
          type: "updateProgress",
          userId,
          maintenanceId: maintenanceDetails.id,
          inProgressChange: !maintenanceDetails.inProgress,
        };

        await addItemToOfflineQueue(newEntry);
      }
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
            const fileUrl = (file as ILocalFile).type
              ? await uploadFile({
                  uri: file.url,
                  type: (file as ILocalFile).type,
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
            const fileUrl = (image as ILocalFile).type
              ? await uploadFile({
                  uri: image.url,
                  type: (image as ILocalFile).type,
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
      } else {
        // Include file and image metadata instead of uploading
        const filesToQueue = files.map((file) => ({
          originalName: file.originalName,
          uri: file.url,
          type: (file as ILocalFile).type,
        }));

        const imagesToQueue = images.map((image) => ({
          originalName: image.originalName,
          uri: image.url,
          type: (image as ILocalFile).type,
        }));

        const newEntry: IOfflineQueueItem = {
          type: "saveProgress",
          userId,
          maintenanceId: maintenanceDetails.id,
          cost: formatedCost,
          files: filesToQueue,
          images: imagesToQueue,
        };

        await addItemToOfflineQueue(newEntry);
      }

      setFiles([]);
      setImages([]);
      setCost("");
      navigation.goBack();
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
            const fileUrl = (file as ILocalFile).type
              ? await uploadFile({
                  uri: file.url,
                  type: (file as ILocalFile).type,
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
            const fileUrl = (image as ILocalFile).type
              ? await uploadFile({
                  uri: image.url,
                  type: (image as ILocalFile).type,
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
      } else {
        // Include file and image metadata instead of uploading
        const filesToQueue = files.map((file) => ({
          originalName: file.originalName,
          uri: file.url,
          type: (file as ILocalFile).type,
        }));

        const imagesToQueue = images.map((image) => ({
          originalName: image.originalName,
          uri: image.url,
          type: (image as ILocalFile).type,
        }));

        const newEntry: IOfflineQueueItem = {
          type: "finishMaintenance",
          userId,
          maintenanceId: maintenanceDetails.id,
          cost: formatedCost,
          files: filesToQueue,
          images: imagesToQueue,
        };

        await addItemToOfflineQueue(newEntry);
      }

      setFiles([]);
      setImages([]);
      setCost("");
      navigation.goBack();
    } catch (error) {
      console.error("Error in handleFinishMaintenance:", error);
    } finally {
      setLoading(false);
    }
  };

  const openFinishMaintenanceAlert = () => {
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
  };

  const canBeEdited =
    maintenanceDetails.MaintenancesStatus.name !== "completed" &&
    maintenanceDetails.MaintenancesStatus.name !== "overdue";

  if (!canBeEdited) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SecondaryButton
        label={maintenanceDetails.inProgress ? "Parar" : "Iniciar"}
        onPress={handleChangeMaintenanceProgress}
      />

      <SecondaryButton label="Salvar" onPress={handleSaveMaintenanceProgress} />

      <PrimaryButton label="Finalizar manutenção" onPress={openFinishMaintenanceAlert} />
    </View>
  );
};
