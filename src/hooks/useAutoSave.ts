import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import NetInfo from "@react-native-community/netinfo";
import { toast } from "sonner-native";

import { uploadFile } from "@/services/mutations/uploadFile";

import type { LocalFile } from "@/types/utils/LocalFile";
import type { IRemoteFile } from "@/types/api/IRemoteFile";

interface Params {
  enable: boolean;
  localFiles: LocalFile[];
  setLocalFiles: Dispatch<SetStateAction<LocalFile[]>>;
  localImages: LocalFile[];
  setLocalImages: Dispatch<SetStateAction<LocalFile[]>>;
  remoteFiles: IRemoteFile[];
  setRemoteFiles: (files: IRemoteFile[]) => void;
  remoteImages: IRemoteFile[];
  setRemoteImages: (images: IRemoteFile[]) => void;
}

export function useAutoSave({
  enable,
  localFiles,
  setLocalFiles,
  localImages,
  setLocalImages,
  remoteFiles,
  setRemoteFiles,
  remoteImages,
  setRemoteImages,
}: Params) {
  const isUploadingRef = useRef(false);

  useEffect(() => {
    if (!enable) return;
    if (isUploadingRef.current) return;
    const hasLocals = localFiles.length > 0 || localImages.length > 0;
    if (!hasLocals) return;

    (async () => {
      isUploadingRef.current = true;
      try {
        const networkState = await NetInfo.fetch();
        const isConnected = networkState.isConnected;

        if (!isConnected) {
          toast.info("Sem conexão com a internet!");
          return;
        }

        const uploadedFileUris = new Set<string>();
        const uploadedImageUris = new Set<string>();

        const filesUploaded: IRemoteFile[] = [];
        const uploadFilesPromises = localFiles.map(async (file) => {
          const { success, data } = await uploadFile({
            uri: file.uri,
            type: file.type,
            name: file.name,
          });
          if (!success) return;
          filesUploaded.push({ name: file.name, url: data.url });
          uploadedFileUris.add(file.uri);
        });

        const imagesUploaded: IRemoteFile[] = [];
        const uploadImagesPromises = localImages.map(async (image) => {
          const { success, data } = await uploadFile({
            uri: image.uri,
            type: image.type,
            name: image.name,
          });
          if (!success) return;
          imagesUploaded.push({ name: image.name, url: data.url });
          uploadedImageUris.add(image.uri);
        });

        await Promise.all([...uploadFilesPromises, ...uploadImagesPromises]);

        const totalUploaded = filesUploaded.length + imagesUploaded.length;
        if (totalUploaded > 0) {
          setRemoteFiles([...remoteFiles, ...filesUploaded]);
          setRemoteImages([...remoteImages, ...imagesUploaded]);

          if (uploadedFileUris.size > 0) {
            setLocalFiles((prev) => prev.filter((f) => !uploadedFileUris.has(f.uri)));
          }
          if (uploadedImageUris.size > 0) {
            setLocalImages((prev) => prev.filter((img) => !uploadedImageUris.has(img.uri)));
          }

          toast.success(
            `Anexos salvos com sucesso!`,
          );
        }
      } finally {
        isUploadingRef.current = false;
      }
    })();
  }, [
    enable,
    localFiles,
    localImages,
    remoteFiles,
    remoteImages,
    setLocalFiles,
    setLocalImages,
    setRemoteFiles,
    setRemoteImages,
  ]);
}