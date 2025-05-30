import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useAuth } from "@/contexts/AuthContext";
import type { ProtectedNavigation } from "@/routes/navigation";
import { createMaintenanceHistoryActivity } from "@/services/createMaintenanceHistoryActivity";
import { uploadFile } from "@/services/uploadFile";
import type { LocalFile } from "@/types/utils/LocalFile";
import type { OfflineQueueItem } from "@/types/utils/OfflineQueueItem";
import { addItemToOfflineQueue } from "@/utils/offlineQueue";
import { openFilePicker } from "@/utils/openFilePicker";

import { styles } from "./styles";

interface CommentsProps {
  maintenanceId: string;
  setLoading: (loading: boolean) => void;
  getMaintenanceHistoryActivities: () => Promise<void>;
}

export const Comments = ({ maintenanceId, setLoading, getMaintenanceHistoryActivities }: CommentsProps) => {
  const navigation = useNavigation<ProtectedNavigation>();
  const { userId } = useAuth();

  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const [comment, setComment] = useState(" ");

  const handleCreateMaintenanceActivity = async () => {
    if (!comment) {
      console.error("Comment está indefinido.");
      return;
    }

    setLoading(true);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    const uploadedFiles = [];

    try {
      if (isConnected) {
        // Handle file uploads when online
        if (localFiles?.length > 0) {
          for (const file of localFiles) {
            const fileUrl = await uploadFile({
              uri: file.url,
              type: file.type!,
              name: file.originalName!,
            });

            uploadedFiles.push({
              originalName: file.originalName!,
              url: fileUrl,
              type: file.type!,
            });
          }
        }

        // If online, send data to the server
        await createMaintenanceHistoryActivity({
          maintenanceId,
          userId,
          content: comment,
          uploadedFile: uploadedFiles,
        });

        await getMaintenanceHistoryActivities();
      } else {
        // Include file metadata instead of uploading
        const filesToQueue = localFiles.map((file) => ({
          originalName: file.originalName,
          uri: file.url,
          type: file.type,
        }));

        const newEntry: OfflineQueueItem = {
          type: "addHistoryActivity",
          userId,
          maintenanceId,
          comment,
          files: filesToQueue,
        };

        await addItemToOfflineQueue(newEntry);

        navigation.goBack();
      }

      setComment("");
      setLocalFiles([]);
    } catch (error) {
      console.error("Error in addHistoryActivity:", error);
    } finally {
      setLoading(false);
    }
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

      {/* Renderização dos arquivos enviados */}
      <View style={styles.filesContainer}>
        {localFiles.map((file, index) => (
          <View key={index} style={styles.fileItem}>
            <View style={styles.fileDetailsContainer}>
              <Text style={styles.fileNameLabel}>{file.originalName}</Text>
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
