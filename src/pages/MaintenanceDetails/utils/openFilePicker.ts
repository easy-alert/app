import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

import type { ILocalFile } from "@/types/ILocalFile";

export const openFilePicker = async (type?: "file" | "image" | null): Promise<ILocalFile[]> => {
  try {
    let files: {
      uri: string;
      name: string;
      type: string;
    }[] = [];

    if (!type) {
      type = await new Promise<"file" | "image" | null>((resolve) => {
        Alert.alert(
          "Seleção de Tipo",
          "O que você gostaria de selecionar?",
          [
            { text: "Arquivo", onPress: () => resolve("file") },
            { text: "Imagem", onPress: () => resolve("image") },
            {
              text: "Cancelar",
              onPress: () => resolve(null),
              style: "cancel",
            },
          ],
          { cancelable: true },
        );
      });

      if (!type) {
        console.log("Ação cancelada pelo usuário.");
        return [];
      }
    }

    if (type === "file") {
      // Seletor de documentos
      const filesResult = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (filesResult.canceled) {
        console.log("Nenhum arquivo selecionado.");
        return [];
      }

      files = filesResult.assets.map((file) => ({
        uri: file.uri,
        name: file.name,
        type: file.mimeType || "application/octet-stream",
      }));
    } else if (type === "image") {
      const userChoice = await new Promise<string>((resolve) => {
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

      if (userChoice === "cancel") {
        console.log("Ação cancelada pelo usuário.");
        return [];
      }

      let imagesResult: ImagePicker.ImagePickerResult | null = null;

      if (userChoice === "camera") {
        // Solicitar permissão para câmera
        const permissionCameraResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionCameraResult.granted) {
          console.log("Permissão necessária para acessar a câmera.");
          return [];
        }

        // Abrir câmera
        imagesResult = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          allowsMultipleSelection: true,
          quality: 1,
        });
      } else if (userChoice === "gallery") {
        // Solicitar permissão para galeria
        const permissionLibraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionLibraryResult.granted) {
          console.log("Permissão necessária para acessar a galeria.");
          return [];
        }

        // Abrir galeria
        imagesResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          allowsMultipleSelection: true,
          quality: 1,
        });
      }

      if (!imagesResult || imagesResult.canceled) {
        console.log("Nenhuma imagem selecionada.");
        return [];
      }

      // Sobrescreve a variável file com os dados da imagem
      files = imagesResult.assets.map((image) => {
        const extension = image.uri.split(".").pop() || "jpg";

        return {
          uri: image.uri,
          type: image.mimeType || "image/jpeg",
          name: `photo-${Date.now()}.${extension}`,
        };
      });
    }

    if (!files) {
      return [];
    }

    return files.map((file) => ({
      originalName: file.name,
      url: file.uri,
      name: file.name,
      type: file.type,
    }));
  } catch (error) {
    console.error("Erro ao selecionar ou enviar:", error);
    return [];
  }
};
