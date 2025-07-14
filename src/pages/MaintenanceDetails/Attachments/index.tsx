import { useState } from "react";
import { ActivityIndicator, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useRequiredAuth } from "@/contexts/AuthContext";

import { openFilePicker } from "@/utils/openFilePicker";
import { removeItem } from "@/utils/removeItem";

import type { IMaintenance } from "@/types/api/IMaintenance";
import type { IRemoteFile } from "@/types/api/IRemoteFile";
import type { LocalFile } from "@/types/utils/LocalFile";

import { styles } from "./styles";

interface AttachmentsProps {
  maintenanceDetails: IMaintenance;
  remoteFiles: IRemoteFile[];
  remoteImages: IRemoteFile[];
  setRemoteFiles: (files: IRemoteFile[]) => void;
  setRemoteImages: (images: IRemoteFile[]) => void;
  localFiles: LocalFile[];
  localImages: LocalFile[];
  setLocalFiles: React.Dispatch<React.SetStateAction<LocalFile[]>>;
  setLocalImages: React.Dispatch<React.SetStateAction<LocalFile[]>>;
}

export const Attachments = ({
  maintenanceDetails,
  remoteFiles,
  remoteImages,
  setRemoteFiles,
  setRemoteImages,
  localFiles,
  localImages,
  setLocalFiles,
  setLocalImages,
}: AttachmentsProps) => {
  const { hasPermission } = useRequiredAuth();

  const [loadingImages, setLoadingImages] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const handleOpenFilePicker = async () => {
    try {
      setLoadingFiles(true);

      const localFiles = await openFilePicker({ mode: "document" });

      if (localFiles.length) {
        setLocalFiles((prev) => [...prev, ...localFiles]);
      }
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleOpenImagePicker = async () => {
    try {
      setLoadingImages(true);

      const localImages = await openFilePicker({ mode: "image", forceCamera: hasPermission("maintenances:livePhoto") });

      if (localImages.length) {
        setLocalImages((prev) => [...prev, ...localImages]);
      }
    } finally {
      setLoadingImages(false);
    }
  };

  const handleRemoveRemoteFile = (index: number) => {
    const newFiles = removeItem(remoteFiles, index);
    setRemoteFiles(newFiles);
  };

  const handleRemoveLocalFile = (index: number) => {
    const newFiles = removeItem(localFiles, index);
    setLocalFiles(newFiles);
  };

  const handleRemoveRemoteImage = (index: number) => {
    const newImages = removeItem(remoteImages, index);
    setRemoteImages(newImages);
  };

  const handleRemoveLocalImage = (index: number) => {
    const newImages = removeItem(localImages, index);
    setLocalImages(newImages);
  };

  const canBeEdited =
    maintenanceDetails.MaintenancesStatus.name !== "completed" &&
    maintenanceDetails.MaintenancesStatus.name !== "overdue";

  const remoteImagesToShow: string[] = canBeEdited
    ? remoteImages.map((image) => image.url)
    : ((maintenanceDetails.MaintenanceReport[0]?.ReportImages.map((image) => image.url) ?? []).filter(
        Boolean,
      ) as string[]);

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleLabel}>Anexos</Text>

        {loadingFiles && <ActivityIndicator size="small" color="#c62828" />}
      </View>

      <View style={styles.contentContainer}>
        {canBeEdited && (
          <TouchableOpacity onPress={handleOpenFilePicker} style={styles.pickerButton}>
            <Icon name="paperclip" size={24} color="#c62828" />
          </TouchableOpacity>
        )}

        <View style={styles.fileList}>
          {localFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
                {file.name}
              </Text>

              <TouchableOpacity onPress={() => handleRemoveLocalFile(index)}>
                <Icon name="x" size={16} color="#fff" style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          ))}

          {remoteFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <TouchableOpacity onPress={() => Linking.openURL(file.url)}>
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
                  {file.name}
                </Text>
              </TouchableOpacity>

              {canBeEdited && (
                <TouchableOpacity onPress={() => handleRemoveRemoteFile(index)}>
                  <Icon name="x" size={16} color="#fff" style={styles.deleteIcon} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleLabel}>Imagens</Text>

        {loadingImages && <ActivityIndicator size="small" color="#c62828" />}
      </View>

      <View style={styles.contentContainer}>
        {canBeEdited && (
          <TouchableOpacity onPress={handleOpenImagePicker} style={styles.pickerButton}>
            <Icon name="image" size={24} color="#c62828" />
          </TouchableOpacity>
        )}

        <View style={styles.fileList}>
          {localImages.map((image, index) => (
            <View key={index} style={styles.fileItem}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />

              <TouchableOpacity onPress={() => handleRemoveLocalImage(index)}>
                <Icon name="x" size={16} color="#fff" style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          ))}

          {remoteImagesToShow.map((image, index) => (
            <View key={index} style={styles.fileItem}>
              <TouchableOpacity onPress={() => Linking.openURL(image)}>
                <Image source={{ uri: image }} style={styles.previewImage} />
              </TouchableOpacity>

              {canBeEdited && (
                <TouchableOpacity onPress={() => handleRemoveRemoteImage(index)}>
                  <Icon name="x" size={16} color="#fff" style={styles.deleteIcon} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
