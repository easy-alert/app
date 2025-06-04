import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { Alert, View } from "react-native";

import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import type { ProtectedNavigation } from "@/routes/navigation";
import { updateMaintenance } from "@/services/updateMaintenance";
import { updateMaintenanceFinish } from "@/services/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/updateMaintenanceProgress";
import { uploadFile } from "@/services/uploadFile";
import type { IMaintenance } from "@/types/api/IMaintenance";
import type { IRemoteFile } from "@/types/api/IRemoteFile";
import type { LocalFile } from "@/types/utils/LocalFile";
import type { OfflineQueueItem } from "@/types/utils/OfflineQueueItem";
import { convertCostToInteger } from "@/utils/convertCostToInteger";
import { addItemToOfflineQueue } from "@/utils/offlineQueue";

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
        const newEntry: OfflineQueueItem = {
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

    const filesUploaded: IRemoteFile[] = [];
    const imagesUploaded: IRemoteFile[] = [];

    try {
      if (isConnected) {
        for (const file of localFiles) {
          const fileUrl = await uploadFile({
            uri: file.uri,
            type: file.type,
            name: file.name,
          });

          if (!fileUrl) {
            continue;
          }

          filesUploaded.push({
            name: file.name,
            url: fileUrl,
          });
        }

        for (const image of localImages) {
          const fileUrl = await uploadFile({
            uri: image.uri,
            type: image.type,
            name: image.name,
          });

          if (!fileUrl) {
            continue;
          }

          imagesUploaded.push({
            name: image.name,
            url: fileUrl,
          });
        }

        await updateMaintenance({
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

        await addItemToOfflineQueue(newEntry);
      }

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

    const filesUploaded: IRemoteFile[] = [];
    const imagesUploaded: IRemoteFile[] = [];

    try {
      if (isConnected) {
        for (const file of localFiles) {
          const fileUrl = await uploadFile({
            uri: file.uri,
            type: file.type,
            name: file.name,
          });

          if (!fileUrl) {
            continue;
          }

          filesUploaded.push({
            name: file.name,
            url: fileUrl,
          });
        }

        for (const image of localImages) {
          const fileUrl = await uploadFile({
            uri: image.uri,
            type: image.type,
            name: image.name,
          });

          if (!fileUrl) {
            continue;
          }

          imagesUploaded.push({
            name: image.name,
            url: fileUrl,
          });
        }

        await updateMaintenanceFinish({
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

        await addItemToOfflineQueue(newEntry);
      }

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
