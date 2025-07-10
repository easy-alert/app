import { Alert } from "react-native";
import { Image as ImageCompressor } from "react-native-compressor";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import type { LocalFile } from "@/types/utils/LocalFile";

type FilePickerMode = "document" | "image" | "request_user_choice";

interface OpenFilePickerProps {
  mode: FilePickerMode;
}

export const openFilePicker = async ({ mode }: OpenFilePickerProps): Promise<LocalFile[]> => {
  try {
    let files: LocalFile[] = [];

    if (mode === "request_user_choice") {
      const choiceMode = await requestUserModeChoice();

      if (choiceMode === "cancel") {
        console.log("Ação cancelada pelo usuário.");
        return [];
      }

      mode = choiceMode;
    }

    if (mode === "document") {
      files = await pickDocuments();
    } else if (mode === "image") {
      const choiceImageMode = await requestUserImageModeChoice();

      if (choiceImageMode === "cancel") {
        console.log("Ação cancelada pelo usuário.");
        return [];
      }

      if (choiceImageMode === "camera") {
        files = await pickImagesFromCamera();
      } else if (choiceImageMode === "gallery") {
        files = await pickImagesFromGallery();
      }
    }

    return files;
  } catch (error) {
    console.error("Erro ao selecionar ou enviar:", error);
    return [];
  }
};

const requestUserModeChoice = (): Promise<"document" | "image" | "cancel"> =>
  new Promise<"document" | "image" | "cancel">((resolve) => {
    Alert.alert(
      "Seleção de Tipo",
      "O que você gostaria de selecionar?",
      [
        { text: "Arquivo", onPress: () => resolve("document") },
        { text: "Imagem", onPress: () => resolve("image") },
        {
          text: "Cancelar",
          onPress: () => resolve("cancel"),
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  });

const pickDocuments = async (): Promise<LocalFile[]> => {
  const documents = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
    multiple: true,
  });

  if (documents.canceled) {
    console.log("Nenhum arquivo selecionado.");
    return [];
  }

  return documents.assets.map((file) => ({
    uri: file.uri,
    name: file.name,
    type: file.mimeType || "application/octet-stream",
  }));
};

const requestUserImageModeChoice = (): Promise<"camera" | "gallery" | "cancel"> => {
  return new Promise<"camera" | "gallery" | "cancel">((resolve) => {
    Alert.alert(
      "Selecionar Imagem",
      "De onde você gostaria de selecionar a imagem?",
      [
        { text: "Câmera", onPress: () => resolve("camera") },
        { text: "Galeria", onPress: () => resolve("gallery") },
        {
          text: "Cancelar",
          onPress: () => resolve("cancel"),
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  });
};

const pickImagesFromCamera = async (): Promise<LocalFile[]> => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    console.log("Permissão necessária para acessar a câmera.");
    return [];
  }

  const images = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    allowsMultipleSelection: true,
  });

  return compressImages(images);
};

const pickImagesFromGallery = async (): Promise<LocalFile[]> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    console.log("Permissão necessária para acessar a galeria.");
    return [];
  }

  const images = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    allowsMultipleSelection: true,
  });

  return compressImages(images);
};

const compressImages = async (imagePickerResult: ImagePicker.ImagePickerResult): Promise<LocalFile[]> => {
  if (imagePickerResult.canceled) {
    console.log("Nenhuma imagem selecionada.");
    return [];
  }

  const images: LocalFile[] = [];

  for (const image of imagePickerResult.assets) {
    const compressedImageUri = await ImageCompressor.compress(image.uri);
    const name = `photo-${Date.now()}.jpg`;

    images.push({
      uri: compressedImageUri,
      name,
      type: "image/jpeg",
    });
  }

  return images;
};
