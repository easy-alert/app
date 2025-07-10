import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { toast } from "sonner-native";

import { useAuth } from "@/contexts/AuthContext";
import { useOfflineQueue } from "@/contexts/OfflineQueueContext";

import type { ProtectedNavigation } from "@/routes/navigation";

import { createMaintenanceHistoryActivity } from "@/services/mutations/createMaintenanceHistoryActivity";
import { uploadFile } from "@/services/mutations/uploadFile";

import { alerts } from "@/utils/alerts";
import { openFilePicker } from "@/utils/openFilePicker";

import { IRemoteFile } from "@/types/api/IRemoteFile";
import type { LocalFile } from "@/types/utils/LocalFile";
import type { OfflineQueueItem } from "@/types/utils/OfflineQueueItem";

import { styles } from "./styles";

interface CommentsProps {
  maintenanceId: string;
  enableComments?: boolean;
  setLoading: (loading: boolean) => void;
  getMaintenanceHistoryActivities: () => Promise<void>;
}

export const Comments = ({
  maintenanceId,
  enableComments = true,
  setLoading,
  getMaintenanceHistoryActivities,
}: CommentsProps) => {
  const navigation = useNavigation<ProtectedNavigation>();
  const { userId } = useAuth();
  const { addItem } = useOfflineQueue();

  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const [comment, setComment] = useState("");

  if (!enableComments) {
    return null;
  }

  const handleCreateMaintenanceActivity = async () => {
    setLoading(true);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    if (isConnected) {
      const filesUploaded: IRemoteFile[] = [];

      const uploadPromises = localFiles.map(async (file) => {
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

      await Promise.all(uploadPromises);

      const { success, message } = await createMaintenanceHistoryActivity({
        maintenanceId,
        userId,
        content: comment,
        filesUploaded: filesUploaded.map((file) => ({
          originalName: file.name,
          name: file.name,
          url: file.url,
        })),
      });

      if (success) {
        toast.success(message);
        await getMaintenanceHistoryActivities();
        setComment("");
        setLocalFiles([]);
      } else {
        alerts.error(message);
      }
    } else {
      const newEntry: OfflineQueueItem = {
        type: "addHistoryActivity",
        userId,
        maintenanceId,
        comment,
        localFiles,
      };

      await addItem(newEntry);
      navigation.goBack();
    }

    setLoading(false);
  };

  const handleRemoveFile = (index: number) => {
    setLocalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenFilePicker = async () => {
    const localFiles = await openFilePicker({ mode: "request_user_choice" });

    if (localFiles.length) {
      setLocalFiles((prev) => [...prev, ...localFiles]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleLabel}>Enviar comentário</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Digite seu comentário"
        value={comment}
        onChangeText={setComment}
        multiline={true}
        numberOfLines={4}
      />

      <View style={styles.filesContainer}>
        {localFiles.map((file, index) => (
          <View key={index} style={styles.fileItem}>
            <View style={styles.fileDetailsContainer}>
              <Text style={styles.fileNameLabel}>{file.name}</Text>
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveFile(index)}>
              <Icon name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleOpenFilePicker}>
          <Icon name="upload" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCreateMaintenanceActivity}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
