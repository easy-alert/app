import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { useState } from "react";

import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import { styles } from "./styles";

import { handleUpload } from "../utils/handleUpload";
import { OFFLINE_QUEUE_KEY } from "../utils/constants";

import type { IUploadedFile } from "@/types/IUploadedFile";
import type { Navigation } from "@/routes/navigation";

import { createMaintenanceHistoryActivity } from "@/services/createMaintenanceHistoryActivity";
import { uploadFile } from "@/services/uploadFile";
import { useAuth } from "@/contexts/AuthContext";

interface CommentsProps {
  maintenanceId: string;
  setLoading: (loading: boolean) => void;
  getMaintenanceHistoryActivities: () => Promise<void>;
}

export const Comments = ({ maintenanceId, setLoading, getMaintenanceHistoryActivities }: CommentsProps) => {
  const navigation = useNavigation<Navigation>();
  const { userId } = useAuth();

  const [uploadedFiles, setUploadedFiles] = useState<IUploadedFile[]>([]);
  const [comment, setComment] = useState(" ");

  const handleCreateMaintenanceActivity = async () => {
    if (!comment) {
      console.error("Comment está indefinido.");
      return;
    }

    setLoading(true);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    const filesUploaded = [];

    try {
      if (isConnected) {
        // Handle file uploads when online
        if (uploadedFiles?.length > 0) {
          for (const file of uploadedFiles) {
            const fileUrl = await uploadFile({
              uri: file.url,
              type: file.type!,
              name: file.originalName!,
            });

            filesUploaded.push({
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
          uploadedFile: filesUploaded,
        });

        setComment("");
        setUploadedFiles([]);
        await getMaintenanceHistoryActivities();

        setLoading(false);
      } else {
        // If offline, save data to a queue in AsyncStorage
        const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

        // Include file metadata instead of uploading
        const filesToQueue = uploadedFiles.map((file) => ({
          originalName: file.originalName,
          uri: file.url,
          type: file.type,
        }));

        const newEntry = {
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
        setUploadedFiles([]);
        setLoading(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error in addHistoryActivity:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.commentSection}>
      <Text style={styles.sectionHeaderText}>Enviar comentário</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Digite seu comentário"
        value={comment}
        onChangeText={setComment}
        multiline={true}
        numberOfLines={4}
      />

      {/* Renderização dos arquivos enviados */}
      <View style={styles.uploadedFilesContainer}>
        {uploadedFiles.map((file, index) => (
          <View key={index} style={styles.uploadedFileItem}>
            <View style={styles.uploadedFileDetails}>
              <Text style={styles.uploadedFileName}>{file.originalName}</Text>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
              }}
            >
              <Icon name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.commentButtons}>
        <TouchableOpacity
          style={styles.commentButton}
          onPress={async () => {
            const uploadedFile = await handleUpload();
            if (uploadedFile) {
              setUploadedFiles((prev) => [...prev, uploadedFile]);
            }
          }}
        >
          <Icon name="upload" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.commentButton} onPress={handleCreateMaintenanceActivity}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
