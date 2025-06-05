import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { Alert, View } from "react-native";
import { toast } from "sonner-native";

import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useOfflineQueue } from "@/contexts/OfflineQueueContext";
import type { ProtectedNavigation } from "@/routes/navigation";
import { updateMaintenance } from "@/services/mutations/updateMaintenance";
import { updateMaintenanceFinish } from "@/services/mutations/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/mutations/updateMaintenanceProgress";
import { uploadFile } from "@/services/mutations/uploadFile";
import type { IMaintenance } from "@/types/api/IMaintenance";
import type { IRemoteFile } from "@/types/api/IRemoteFile";
import type { LocalFile } from "@/types/utils/LocalFile";
import type { OfflineQueueItem } from "@/types/utils/OfflineQueueItem";
import { alertMessage } from "@/utils/alerts";
import { convertCostToInteger } from "@/utils/convertCostToInteger";

import { styles } from "./styles";

interface CallToActionsProps {
  maintenanceDetails: IMaintenance;
  localFiles: LocalFile[];
  localImages: LocalFile[];
  remoteFiles: IRemoteFile[];
  remoteImages: IRemoteFile[];
  cost: string;
  setLoading: (loading: boolean) => void;
}

export const CallToActions = ({
  maintenanceDetails,
  localFiles,
  localImages,
  remoteFiles,
  remoteImages,
  cost,
  setLoading,
}: CallToActionsProps) => {
  const navigation = useNavigation<ProtectedNavigation>();
  const { userId } = useAuth();
  const { addItem } = useOfflineQueue();

  const handleChangeMaintenanceProgress = async () => {
    setLoading(true);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    if (isConnected) {
      const { success, message } = await updateMaintenanceProgress({
        maintenanceHistoryId: maintenanceDetails.id,
        inProgressChange: !maintenanceDetails.inProgress,
        syndicNanoId: "",
        userId,
      });

      if (success) {
        toast.success(message);
        navigation.goBack();
      } else {
        alertMessage({ type: "error", message });
      }
    } else {
      const newEntry: OfflineQueueItem = {
        type: "updateProgress",
        userId,
        maintenanceId: maintenanceDetails.id,
        inProgressChange: !maintenanceDetails.inProgress,
      };

      await addItem(newEntry);
      navigation.goBack();
    }

    setLoading(false);
  };

  const handleSaveMaintenanceProgress = async () => {
    setLoading(true);

    const formatedCost = convertCostToInteger(cost);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    if (isConnected) {
      const filesUploaded: IRemoteFile[] = [];

      const uploadFilesPromises = localFiles.map(async (file) => {
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

      const uploadImagesPromises = localImages.map(async (image) => {
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

      const { success, message } = await updateMaintenance({
        maintenanceHistoryId: maintenanceDetails.id,
        syndicNanoId: "",
        userId,
        maintenanceReport: {
          cost: formatedCost,
          observation: "",
        },
        files: [...filesUploaded, ...remoteFiles].map((file) => ({
          originalName: file.name,
          name: file.name,
          url: file.url,
        })),
        images: [...imagesUploaded, ...remoteImages].map((image) => ({
          originalName: image.name,
          name: image.name,
          url: image.url,
        })),
      });

      if (success) {
        toast.success(message);
        navigation.goBack();
      } else {
        alertMessage({ type: "error", message });
      }
    } else {
      const newEntry: OfflineQueueItem = {
        type: "saveProgress",
        userId,
        maintenanceId: maintenanceDetails.id,
        cost: formatedCost,
        localFiles,
        localImages,
        remoteFiles,
        remoteImages,
      };

      await addItem(newEntry);
      navigation.goBack();
    }

    setLoading(false);
  };

  const handleFinishMaintenance = async () => {
    setLoading(true);

    const formatedCost = convertCostToInteger(cost);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    if (isConnected) {
      const filesUploaded: IRemoteFile[] = [];

      const uploadFilesPromises = localFiles.map(async (file) => {
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

      const uploadImagesPromises = localImages.map(async (image) => {
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

      const { success, message } = await updateMaintenanceFinish({
        maintenanceHistoryId: maintenanceDetails.id,
        syndicNanoId: "",
        userId,
        maintenanceReport: {
          cost: formatedCost,
          observation: "",
        },
        files: [...filesUploaded, ...remoteFiles].map((file) => ({
          originalName: file.name,
          name: file.name,
          url: file.url,
        })),
        images: [...imagesUploaded, ...remoteImages].map((image) => ({
          originalName: image.name,
          name: image.name,
          url: image.url,
        })),
      });

      if (success) {
        toast.success(message);
        navigation.goBack();
      } else {
        alertMessage({ type: "error", message });
      }
    } else {
      const newEntry: OfflineQueueItem = {
        type: "finishMaintenance",
        userId,
        maintenanceId: maintenanceDetails.id,
        cost: formatedCost,
        localFiles,
        localImages,
        remoteFiles,
        remoteImages,
      };

      await addItem(newEntry);
      navigation.goBack();
    }

    setLoading(false);
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
