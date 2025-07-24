import { Alert, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { toast } from "sonner-native";

import { useRequiredAuth } from "@/contexts/AuthContext";
import { useOfflineQueue } from "@/contexts/OfflineQueueContext";

import { PrimaryButton, SecondaryButton } from "@/components/Button";

import type { ProtectedNavigation } from "@/routes/navigation";

import { updateMaintenance } from "@/services/mutations/updateMaintenance";
import { updateMaintenanceFinish } from "@/services/mutations/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@/services/mutations/updateMaintenanceProgress";
import { updateMaintenanceReport } from "@/services/mutations/updateMaintenanceReport";
import { uploadFile } from "@/services/mutations/uploadFile";

import { alerts } from "@/utils/alerts";
import { convertCostToInteger } from "@/utils/convertCostToInteger";

import type { IMaintenance } from "@/types/api/IMaintenance";
import type { IRemoteFile } from "@/types/api/IRemoteFile";
import type { LocalFile } from "@/types/utils/LocalFile";
import type { OfflineQueueItem } from "@/types/utils/OfflineQueueItem";

import { styles } from "./styles";

interface CallToActionsProps {
  maintenanceDetails: IMaintenance;
  localFiles: LocalFile[];
  localImages: LocalFile[];
  remoteFiles: IRemoteFile[];
  remoteImages: IRemoteFile[];
  cost: string;
  setLoading: (loading: boolean) => void;
  isFinished: boolean;
  isEditingReport: boolean;
  handleChangeEditingReport: (state: boolean) => void;
}

export const CallToActions = ({
  maintenanceDetails,
  localFiles,
  localImages,
  remoteFiles,
  remoteImages,
  cost,
  setLoading,
  isFinished,
  isEditingReport,
  handleChangeEditingReport,
}: CallToActionsProps) => {
  const navigation = useNavigation<ProtectedNavigation>();
  const {
    user: { id: userId },
  } = useRequiredAuth();
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
        alerts.error(message);
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
        alerts.error(message);
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
        alerts.error(message);
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

  const handleUpdateMaintenanceReport = async () => {
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

      const { success, message } = await updateMaintenanceReport({
        maintenanceHistoryId: maintenanceDetails.id,
        maintenanceReport: {
          id: maintenanceDetails.MaintenanceReport?.[0].id || "",
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
        alerts.error(message);
      }
    } else {
      const newEntry: OfflineQueueItem = {
        type: "updateMaintenanceReport",
        userId,
        maintenanceId: maintenanceDetails.id,
        maintenanceReportId: maintenanceDetails.MaintenanceReport?.[0].id || "",
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

    handleChangeEditingReport(!isEditingReport);
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

  const openUpdateMaintenanceReportAlert = () => {
    Alert.alert("Confirmar Ação", "Tem certeza de que deseja atualizar o relatório?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: handleUpdateMaintenanceReport,
      },
    ]);
  };

  return (
    <View style={[styles.container, isFinished && !isEditingReport && { justifyContent: "center" }]}>
      {isFinished ? (
        <>
          {isEditingReport && (
            <SecondaryButton label="Voltar" onPress={() => handleChangeEditingReport(!isEditingReport)} />
          )}

          <PrimaryButton
            label={isEditingReport ? "Atualizar relatório" : "Editar relatório"}
            onPress={() => {
              if (isEditingReport) {
                openUpdateMaintenanceReportAlert();
              } else {
                handleChangeEditingReport(!isEditingReport);
                Alert.alert("Editar relatório", "A seguir você conseguira editar o relatório da manutenção.");
              }
            }}
          />
        </>
      ) : (
        <>
          <SecondaryButton
            label={maintenanceDetails.inProgress ? "Parar" : "Iniciar"}
            onPress={handleChangeMaintenanceProgress}
          />
          <SecondaryButton label="Salvar" onPress={handleSaveMaintenanceProgress} />

          <PrimaryButton label="Finalizar manutenção" onPress={openFinishMaintenanceAlert} />
        </>
      )}
    </View>
  );
};
