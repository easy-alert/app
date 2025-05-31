import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import type { IMaintenance } from "@/types/api/IMaintenance";
import type { IRemoteFile } from "@/types/api/IRemoteFile";
import type { LocalFile } from "@/types/utils/LocalFile";
import { openFilePicker } from "@/utils/openFilePicker";
import { removeItem } from "@/utils/removeItem";

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
  const handleOpenFilePicker = async () => {
    const localFiles = await openFilePicker({ mode: "document" });

    if (localFiles.length) {
      setLocalFiles((prev) => [...prev, ...localFiles]);
    }
  };

  const handleOpenImagePicker = async () => {
    const localImages = await openFilePicker({ mode: "image" });

    if (localImages.length) {
      setLocalImages((prev) => [...prev, ...localImages]);
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
      <Text style={styles.titleLabel}>Anexos</Text>

      <View style={styles.contentContainer}>
        {canBeEdited && (
          <TouchableOpacity onPress={handleOpenFilePicker}>
            <Icon name="paperclip" size={24} color="#c62828" />
          </TouchableOpacity>
        )}

        <View style={styles.fileList}>
          {/* TODO: deixar com uma cor diferente quando for local e remover o openURL */}
          {localFiles.map((file, index) => (
            <TouchableOpacity key={index} onPress={async () => Linking.openURL(file.url)}>
              <View style={styles.fileItem}>
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
                  {file.originalName}
                </Text>

                <TouchableOpacity onPress={() => handleRemoveLocalFile(index)}>
                  <Icon name="x" size={16} color="#fff" style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          {remoteFiles.map((file, index) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
              <View style={styles.fileItem}>
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
                  {file.originalName}
                </Text>

                {canBeEdited && (
                  <TouchableOpacity onPress={() => handleRemoveRemoteFile(index)}>
                    <Icon name="x" size={16} color="#fff" style={styles.deleteIcon} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.titleLabel}>Imagens</Text>

      <View style={styles.contentContainer}>
        {canBeEdited && (
          <TouchableOpacity onPress={handleOpenImagePicker}>
            <Icon name="image" size={24} color="#c62828" />
          </TouchableOpacity>
        )}

        <View style={styles.fileList}>
          {/* TODO: deixar com uma cor diferente quando for local e remover o openURL */}
          {localImages.map((image, index) => (
            <View key={index} style={styles.fileItem}>
              <TouchableOpacity onPress={() => Linking.openURL(image.url)}>
                <Image source={{ uri: image.url }} style={styles.previewImage} />
              </TouchableOpacity>

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
