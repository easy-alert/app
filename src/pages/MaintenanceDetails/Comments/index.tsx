import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { useState } from "react";

import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { createMaintenanceHistoryActivity } from "@/services/createMaintenanceHistoryActivity";
import { uploadFile } from "@/services/uploadFile";
import { useAuth } from "@/contexts/AuthContext";
import { OFFLINE_QUEUE_KEY } from "@/utils/offlineQueue";

import { styles } from "./styles";

import { openFilePicker } from "../utils/openFilePicker";

import type { IOfflineQueueItem } from "@/types/IOfflineQueueItem";
import type { ILocalFile } from "@/types/ILocalFile";
import type { Navigation } from "@/routes/navigation";

interface CommentsProps {
  maintenanceId: string;
  setLoading: (loading: boolean) => void;
  getMaintenanceHistoryActivities: () => Promise<void>;
}

export const Comments = ({ maintenanceId, setLoading, getMaintenanceHistoryActivities }: CommentsProps) => {
  const navigation = useNavigation<Navigation>();
  const { userId } = useAuth();

  const [localFiles, setLocalFiles] = useState<ILocalFile[]>([]);
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

        setComment("");
        setLocalFiles([]);
        await getMaintenanceHistoryActivities();

        setLoading(false);
      } else {
        // If offline, save data to a queue in AsyncStorage
        const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

        // Include file metadata instead of uploading
        const filesToQueue = localFiles.map((file) => ({
          originalName: file.originalName,
          uri: file.url,
          type: file.type,
        }));

        const newEntry: IOfflineQueueItem = {
          type: "addHistoryActivity",
          userId,
          maintenanceId,
          comment,
          files: filesToQueue,
          timestamp: new Date().toISOString(),
        };

        offlineQueue.push(newEntry);
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
        setComment("");
        setLocalFiles([]);
        setLoading(false);
        navigation.goBack();
      }
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
    const localFile = await openFilePicker();

    if (localFile) {
      setLocalFiles((prev) => [...prev, localFile]);
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
