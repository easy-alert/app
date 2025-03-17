import { Alert } from "react-native";

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export const handleUpload = async (
  type?: "file" | "image" | null,
): Promise<{
  originalName: string;
  url: string;
  name: string;
  type: string;
} | null> => {
  try {
    let file: { uri: string; name: string; type: string } | null = null;

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
        return null;
      }
    }

    if (type === "file") {
      // Seletor de documentos
      const fileResult = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (fileResult.canceled) {
        console.log("Nenhum arquivo selecionado.");
        return null;
      }

      const { uri, name, mimeType } = fileResult.assets[0];
      file = { uri, name, type: mimeType || "application/octet-stream" };
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
        return null;
      }

      let imageResult;

      if (userChoice === "camera") {
        // Solicitar permissão para câmera
        const permissionCameraResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionCameraResult.granted) {
          console.log("Permissão necessária para acessar a câmera.");
          return null;
        }

        // Abrir câmera
        imageResult = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      } else if (userChoice === "gallery") {
        // Solicitar permissão para galeria
        const permissionLibraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionLibraryResult.granted) {
          console.log("Permissão necessária para acessar a galeria.");
          return null;
        }

        // Abrir galeria
        imageResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
      }

      if (imageResult?.canceled) {
        console.log("Nenhuma imagem selecionada.");
        return null;
      }

      // Sobrescreve a variável file com os dados da imagem
      file = {
        uri: imageResult?.assets[0].uri || "",
        type: "image/jpeg",
        name: `photo-${Date.now()}.jpg`,
      };
    }

    if (!file) {
      return null;
    }

    // const fileUrl = await uploadFile(file);

    // Fazer upload
    return {
      originalName: file.name,
      url: file.uri,
      name: file.name,
      type: file.type,
    };

    // if (fileUrl) {
    //   console.log(
    //     "Upload Concluído",
    //     `${type === "image" ? "Imagem" : "Arquivo"} enviado com sucesso!`
    //   );
    //   return { originalName: file.name, url: fileUrl, name: file.name };
    // } else {
    //   console.error(
    //     `Falha no upload do ${type === "image" ? "imagem" : "arquivo"}.`
    //   );
    //   return null;
    // }
  } catch (error) {
    console.error("Erro ao selecionar ou enviar:", error);
    return null;
  }
};
