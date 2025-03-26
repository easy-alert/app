import { View, Text, TouchableOpacity, Image, Linking } from "react-native";

import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

import { removeItem } from "../utils/removeItem";
import { handleUpload } from "../utils/handleUpload";

import type { IMaintenance } from "@/types/IMaintenance";

interface AttachmentsProps {
  maintenanceDetailsData?: IMaintenance;
  files: { originalName: string; url: string; name: string }[];
  images: { originalName: string; url: string; name: string }[];
  setFiles: React.Dispatch<
    React.SetStateAction<
      {
        originalName: string;
        url: string;
        name: string;
      }[]
    >
  >;
  setImages: React.Dispatch<
    React.SetStateAction<
      {
        originalName: string;
        url: string;
        name: string;
      }[]
    >
  >;
}

export const Attachments = ({ maintenanceDetailsData, files, images, setFiles, setImages }: AttachmentsProps) => {
  return (
    <View>
      {/* Botão de anexar arquivos */}
      <Text style={styles.sectionHeaderText}>Anexos</Text>
      <View style={styles.uploadContainer}>
        {maintenanceDetailsData?.MaintenancesStatus.name !== "completed" &&
          maintenanceDetailsData?.MaintenancesStatus.name !== "overdue" && (
            <TouchableOpacity
              onPress={async () => {
                const uploadedFile = await handleUpload("file"); // Chama o método de upload para arquivos

                if (uploadedFile) {
                  setFiles((prev) => [...prev, uploadedFile]); // Atualiza o estado de arquivos
                }
              }}
            >
              <Icon name="paperclip" size={24} color="#c62828" />
            </TouchableOpacity>
          )}
        <View style={styles.fileList}>
          {files.map((file, index) => (
            <TouchableOpacity onPress={() => Linking.openURL(file.url)}>
              <View key={index} style={styles.fileItem}>
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
                  {file.originalName}
                </Text>
                {maintenanceDetailsData?.MaintenancesStatus.name !== "completed" &&
                  maintenanceDetailsData?.MaintenancesStatus.name !== "overdue" && (
                    <TouchableOpacity
                      onPress={() => {
                        const updatedFiles = removeItem(images, index);
                        setFiles(updatedFiles);
                      }}
                    >
                      <Icon name="x" size={16} color="#fff" style={styles.deleteIcon} />
                    </TouchableOpacity>
                  )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botão de anexar imagens */}
      <Text style={styles.sectionHeaderText}>Imagens</Text>
      <View style={styles.uploadContainer}>
        {maintenanceDetailsData?.MaintenancesStatus.name !== "completed" &&
          maintenanceDetailsData?.MaintenancesStatus.name !== "overdue" && (
            <TouchableOpacity
              onPress={async () => {
                const uploadedImage = await handleUpload("image");

                if (uploadedImage) {
                  setImages((prev) => [...prev, uploadedImage]);
                }
              }}
            >
              <Icon name="image" size={24} color="#c62828" />
            </TouchableOpacity>
          )}
        <View style={styles.fileList}>
          {images.map((image, index) => (
            <View key={index} style={styles.fileItem}>
              <TouchableOpacity onPress={() => Linking.openURL(image.url)}>
                <Image source={{ uri: image.url }} style={styles.previewImage} />
              </TouchableOpacity>
              {maintenanceDetailsData?.MaintenancesStatus.name !== "completed" &&
                maintenanceDetailsData?.MaintenancesStatus.name !== "overdue" && (
                  <TouchableOpacity
                    onPress={() => {
                      const updatedImages = removeItem(images, index);
                      setImages(updatedImages);
                    }}
                  >
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
