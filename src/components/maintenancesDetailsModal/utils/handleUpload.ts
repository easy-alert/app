import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { uploadFile } from "../../../services/uploadFile"; // Ajuste o caminho conforme necessário

export const handleUpload = async (
  type: "file" | "image"
): Promise<{ originalName: string; url: string; name: string } | null> => {
  try {
    let file: { uri: string; name: string; type: string } | null = null;

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
      // Permissões para imagens
      const permissionLibraryResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const permissionCameraResult =
        await ImagePicker.getCameraPermissionsAsync();

      if (!permissionLibraryResult.granted || !permissionCameraResult.granted) {
        console.log("Permissão necessária para acessar a galeria ou câmera.");
        return null;
      }

      const imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (imageResult.canceled) {
        console.log("Nenhuma imagem selecionada.");
        return null;
      }

      file = {
        uri: imageResult.assets[0].uri,
        type: "image/jpeg",
        name: `photo-${Date.now()}.jpg`,
      };
    }

    if (!file) {
      return null;
    }

    // Fazer upload
    const fileUrl = await uploadFile(file);

    if (fileUrl) {
      console.log(
        "Upload Concluído",
        `${type === "image" ? "Imagem" : "Arquivo"} enviado com sucesso!`
      );
      return { originalName: file.name, url: fileUrl, name: file.name };
    } else {
      console.error(
        `Falha no upload do ${type === "image" ? "imagem" : "arquivo"}.`
      );
      return null;
    }
  } catch (error) {
    console.error("Erro ao selecionar ou enviar:", error);
    return null;
  }
};
