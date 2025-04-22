import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import type { ILocalFile } from "@/types/ILocalFile";
import type { IMaintenance } from "@/types/IMaintenance";
import type { IRemoteFile } from "@/types/IRemoteFile";

import { openFilePicker } from "../utils/openFilePicker";
import { removeItem } from "../utils/removeItem";
import { styles } from "./styles";

interface AttachmentsProps {
  maintenanceDetails: IMaintenance;
  files: (IRemoteFile | ILocalFile)[];
  images: (IRemoteFile | ILocalFile)[];
  setFiles: React.Dispatch<React.SetStateAction<(IRemoteFile | ILocalFile)[]>>;
  setImages: React.Dispatch<React.SetStateAction<(IRemoteFile | ILocalFile)[]>>;
}

export const Attachments = ({ maintenanceDetails, files, images, setFiles, setImages }: AttachmentsProps) => {
  const handleOpenFilePicker = async () => {
    const localFile = await openFilePicker("file");

    if (localFile) {
      setFiles((prev) => [...prev, localFile]);
    }
  };

  const handleOpenImagePicker = async () => {
    const localFile = await openFilePicker("image");

    if (localFile) {
      setImages((prev) => [...prev, localFile]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = removeItem(files, index);
    setFiles(newFiles);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = removeItem(images, index);
    setImages(newImages);
  };

  const canBeEdited =
    maintenanceDetails.MaintenancesStatus.name !== "completed" &&
    maintenanceDetails.MaintenancesStatus.name !== "overdue";

  const imagesToShow: string[] = canBeEdited
    ? images.map((image) => image.url)
    : ((maintenanceDetails.MaintenanceReport[0]?.ReportImages.map((image) => image.url) ?? []).filter(
        Boolean,
      ) as string[]);

  return (
    <View>
      {/* Botão de anexar arquivos */}
      <Text style={styles.titleLabel}>Anexos</Text>

      <View style={styles.contentContainer}>
        {canBeEdited && (
          <TouchableOpacity onPress={handleOpenFilePicker}>
            <Icon name="paperclip" size={24} color="#c62828" />
          </TouchableOpacity>
        )}

        <View style={styles.fileList}>
          {files.map((file, index) => (
            <TouchableOpacity key={index} onPress={() => Linking.openURL(file.url)}>
              <View style={styles.fileItem}>
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
                  {file.originalName}
                </Text>

                {canBeEdited && (
                  <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                    <Icon name="x" size={16} color="#fff" style={styles.deleteIcon} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botão de anexar imagens */}
      <Text style={styles.titleLabel}>Imagens</Text>

      <View style={styles.contentContainer}>
        {canBeEdited && (
          <TouchableOpacity onPress={handleOpenImagePicker}>
            <Icon name="image" size={24} color="#c62828" />
          </TouchableOpacity>
        )}

        <View style={styles.fileList}>
          {imagesToShow.map((image, index) => (
            <View key={index} style={styles.fileItem}>
              <TouchableOpacity onPress={() => Linking.openURL(image)}>
                <Image source={{ uri: image }} style={styles.previewImage} />
              </TouchableOpacity>

              {canBeEdited && (
                <TouchableOpacity onPress={() => handleRemoveImage(index)}>
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
