import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

import Icon from "react-native-vector-icons/Feather";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation, useRoute } from "@react-navigation/native";

import { createMaintenanceHistoryActivity } from "@services/createMaintenanceHistoryActivity";
import { getMaintenanceDetails } from "@services/getMaintenanceDetails";
import { getMaintenanceHistoryActivities } from "@services/getMaintenanceHistoryActivities";
import { getMaintenanceHistorySupplier } from "@services/getMaintenanceHistorySupplier";
import { getMaintenanceReportProgress } from "@services/getMaintenanceReportProgress";
import { unlinkMaintenanceSupplier } from "@services/unlinkMaintenanceSupplier";
import { updateMaintenance } from "@services/updateMaintenance";
import { updateMaintenanceFinish } from "@services/updateMaintenanceFinish";
import { updateMaintenanceProgress } from "@services/updateMaintenanceProgress";
import { uploadFile } from "@services/uploadFile";
import { formatDate } from "@utils/formatDate";
import { getStatus } from "@utils/getStatus"; // Ajuste o caminho para a função getStatus

import { MaintenanceDetailsProps } from "@routes/navigation";

import { SupplierModal } from "@components/supplierModal";

import { styles } from "./styles";
import { convertCostToInteger } from "./utils/convertCostToInteger";
import { handleUpload } from "./utils/handleUpload";
import { removeItem } from "./utils/removeItem";

import type { IMaintenanceHistoryActivities } from "../../types/IMaintenanceHistoryActivities";
import type { IAnnexesAndImages } from "../../types/IAnnexesAndImages";
import type { IMaintenance } from "../../types/IMaintenance";
import type { IUploadedFile } from "../../types/IUploadedFile";
import type { ISupplier } from "../../types/ISupplier";

export const MaintenanceDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { maintenanceId, userId } = route.params as MaintenanceDetailsProps;

  const [maintenanceDetailsData, setMaintenanceDetailsData] = useState<IMaintenance>();
  const [supplierData, setSupplierData] = useState<ISupplier | null>();
  const [historyActivitiesData, setHistoryActivitiesData] = useState<IMaintenanceHistoryActivities>();

  const [cost, setCost] = useState("0,00"); // Estado para o custo

  const [uploadedFiles, setUploadedFiles] = useState<IUploadedFile[]>([]); // Arquivos já upados
  const [files, setFiles] = useState<{ originalName: string; url: string; name: string }[]>([]); // Estado para os arquivos ainda não upados
  const [images, setImages] = useState<{ originalName: string; url: string; name: string }[]>([]); // Estado para as imagens ainda não upadas

  const [comment, setComment] = useState(" ");
  const [activeTab, setActiveTab] = useState<"comment" | "notification">("comment");

  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const OFFLINE_QUEUE_KEY = "offline_queue";

  const filteredData = historyActivitiesData?.maintenanceHistoryActivities?.filter((item) => item.type === activeTab);

  const toggleSupplierModal = async () => {
    handleGetMaintenanceSupplier();
    setShowSupplierModal((prev) => !prev);
  };

  const formatCurrency = (text: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = text.replace(/[^0-9]/g, "");

    // Converte para um número
    const value = parseFloat(numericValue) / 100;

    // Formata no padrão brasileiro
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleChangeCost = (text: string) => {
    const formatted = formatCurrency(text);
    setCost(formatted);
  };

  const handleGetMaintenanceDetails = async () => {
    try {
      const responseData = await getMaintenanceDetails({
        maintenanceHistoryId: maintenanceId,
      });

      setMaintenanceDetailsData(responseData);
    } catch (error) {
      console.error("🚀 ~ handleGetMaintenanceDetails ~ error:", error);
    }
  };

  const handleGetMaintenanceReportProgress = async () => {
    try {
      const responseData = await getMaintenanceReportProgress({
        maintenanceHistoryId: maintenanceId,
      });

      setCost(String(responseData?.progress?.cost || 0 / 100).replace(".", ","));
      setFiles(responseData?.progress?.ReportAnnexesProgress || []);
      setImages(responseData?.progress?.ReportImagesProgress || []);
    } catch (error) {
      console.error("🚀 ~ handleGetMaintenanceReportProgress ~ error:", error);
    }
  };

  const handleGetMaintenanceHistoryActivities = async () => {
    try {
      const responseData = await getMaintenanceHistoryActivities({
        maintenanceHistoryId: maintenanceId,
      });

      setHistoryActivitiesData(responseData);
    } catch (error) {
      console.error("🚀 ~ handleGetMaintenanceReportProgress ~ error:", error);
    }
  };

  const handleGetMaintenanceSupplier = async () => {
    try {
      const responseData = await getMaintenanceHistorySupplier({
        maintenanceHistoryId: maintenanceId,
      });

      if (responseData?.suppliers?.length === 0) {
        setSupplierData(null);
        return;
      }

      setSupplierData(responseData?.suppliers[0]);
    } catch (error) {
      console.error("🚀 ~ handleGetMaintenanceSupplier ~ error:", error);
    }
  };

  const handleUnlinkMaintenanceSupplier = async (supplierId: string) => {
    const userId = await AsyncStorage.getItem("userId");

    if (!userId) {
      console.error("User ID está indefinido.");
      return;
    }

    await unlinkMaintenanceSupplier({
      maintenanceHistoryId: maintenanceId,
      supplierId,
      userId,
    });

    await handleGetMaintenanceSupplier();
  };

  const handleCreateMaintenanceActivity = async (
    userId: string,
    maintenanceId: string,
    comment: string,
    images?: any,
  ) => {
    setLoading(true);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    const filesUploaded = [];

    try {
      if (isConnected) {
        // Handle file uploads when online
        if (images?.length > 0) {
          for (const file of images) {
            const fileUrl = await uploadFile({
              uri: file.url,
              type: file.type,
              name: file.originalName,
            });

            filesUploaded.push({
              originalName: file.originalName,
              url: fileUrl,
              type: file.type,
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
        await handleGetMaintenanceHistoryActivities();

        setLoading(false);
      } else {
        // If offline, save data to a queue in AsyncStorage
        const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

        // Include file metadata instead of uploading
        const filesToQueue = images.map((file: { originalName: any; url: any; type: any }) => ({
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

  const handleChangeMaintenanceProgress = async () => {
    setLoading(true);

    try {
      await updateMaintenanceProgress({
        maintenanceHistoryId: maintenanceId,
        inProgressChange: !maintenanceDetailsData?.inProgress,
        syndicNanoId: "",
        userId,
      });
    } finally {
      navigation.goBack();
      setLoading(false);
    }
  };

  const handleSaveMaintenanceProgress = async (
    userId: string,
    maintenanceId: string,
    cost: number,
    files: any,
    images: any,
  ) => {
    setLoading(true);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    const filesUploaded = [] as IAnnexesAndImages[];
    const imagesUploaded = [] as IAnnexesAndImages[];

    try {
      if (isConnected) {
        // Handle file uploads when online
        if (files?.length > 0) {
          for (const file of files) {
            const fileUrl = file.type
              ? await uploadFile({
                  uri: file.url,
                  type: file.type,
                  name: file.originalName,
                })
              : file.url;

            filesUploaded.push({
              originalName: file.originalName,
              url: fileUrl,
              name: file.originalName,
            });
          }
        }

        if (images?.length > 0) {
          for (const image of images) {
            const fileUrl = image.type
              ? await uploadFile({
                  uri: image.url,
                  type: image.type,
                  name: image.originalName,
                })
              : image.url;

            imagesUploaded.push({
              originalName: image.originalName,
              url: fileUrl,
              name: image.originalName,
            });
          }
        }

        // If online, send data to the server
        await updateMaintenance({
          maintenanceHistoryId: maintenanceId,
          syndicNanoId: "",
          userId,
          maintenanceReport: {
            cost: cost,
            observation: "",
          },
          files: filesUploaded,
          images: imagesUploaded,
        });

        setFiles([]);
        setImages([]);
        setCost("");
        navigation.goBack();
      } else {
        // If offline, save data to a queue in AsyncStorage
        const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

        // Include file and image metadata instead of uploading
        const filesToQueue = files.map((file: { originalName: any; url: any; type: any }) => ({
          originalName: file.originalName,
          uri: file.url,
          type: file.type,
        }));

        const imagesToQueue = images.map((image: { originalName: any; url: any; type: any }) => ({
          originalName: image.originalName,
          uri: image.url,
          type: image.type,
        }));

        const newEntry = {
          type: "saveProgress",
          userId,
          maintenanceId,
          cost,
          files: filesToQueue,
          images: imagesToQueue,
          timestamp: new Date().toISOString(),
        };

        offlineQueue.push(newEntry);
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));

        setFiles([]);
        setImages([]);
        setCost("");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error in saveProgress:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishMaintenance = async (
    userId: string,
    maintenanceId: string,
    cost: number,
    files: any,
    images: any,
  ) => {
    setLoading(true);

    const networkState = await NetInfo.fetch();
    const isConnected = networkState.isConnected;

    const filesUploaded = [];
    const imagesUploaded = [];

    try {
      if (isConnected) {
        // Handle file uploads when online
        if (files?.length > 0) {
          for (const file of files) {
            const fileUrl = file.type
              ? await uploadFile({
                  uri: file.url,
                  type: file.type,
                  name: file.originalName,
                })
              : file.url;

            filesUploaded.push({
              originalName: file.originalName,
              url: fileUrl,
              name: file.originalName,
            });
          }
        }

        if (images?.length > 0) {
          for (const image of images) {
            const fileUrl = image.type
              ? await uploadFile({
                  uri: image.url,
                  type: image.type,
                  name: image.originalName,
                })
              : image.url;

            imagesUploaded.push({
              originalName: image.originalName,
              url: fileUrl,
              name: image.originalName,
            });
          }
        }

        // If online, send data to the server
        await updateMaintenanceFinish({
          maintenanceHistoryId: maintenanceId,
          syndicNanoId: "",
          userId,
          maintenanceReport: {
            cost: cost,
            observation: "",
          },
          files: filesUploaded,
          images: imagesUploaded,
        });

        setFiles([]);
        setImages([]);
        setCost("");
        navigation.goBack();
      } else {
        // If offline, save data to a queue in AsyncStorage
        const offlineQueueString = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];

        // Include file and image metadata instead of uploading
        const filesToQueue = files.map((file: { originalName: any; url: any; type: any }) => ({
          originalName: file.originalName,
          uri: file.url,
          type: file.type,
        }));

        const imagesToQueue = images.map((image: { originalName: any; url: any; type: any }) => ({
          originalName: image.originalName,
          uri: image.url,
          type: image.type,
        }));

        const newEntry = {
          type: "finishMaintenance",
          userId,
          maintenanceId,
          cost,
          files: filesToQueue,
          images: imagesToQueue,
          timestamp: new Date().toISOString(),
        };

        offlineQueue.push(newEntry);
        await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));

        setFiles([]);
        setImages([]);
        setCost("");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error in handleFinishMaintenance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!maintenanceId) return;

    setLoading(true);

    try {
      handleGetMaintenanceReportProgress();
      handleGetMaintenanceDetails();
      handleGetMaintenanceSupplier();
      handleGetMaintenanceHistoryActivities();
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenanceId]);

  return (
    <>
      <SupplierModal
        maintenanceId={maintenanceId}
        userId={userId}
        visible={showSupplierModal}
        onClose={toggleSupplierModal}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ff3535"
          style={{ alignContent: "center", justifyContent: "center", flex: 1 }}
        />
      ) : (
        <View style={styles.overlay}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <SafeAreaView style={styles.fullContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>Enviar relato</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                  <Icon name="x" size={28} color="#b21d1d" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.content} nestedScrollEnabled={true}>
                <Text style={styles.buildingName}>{maintenanceDetailsData?.Building.name}</Text>

                <View style={styles.tags}>
                  <View
                    style={[
                      styles.tag,
                      {
                        backgroundColor: getStatus(maintenanceDetailsData?.MaintenancesStatus.name!).color,
                      },
                    ]}
                  >
                    <Text style={styles.tagText}>
                      {getStatus(maintenanceDetailsData?.MaintenancesStatus.name!).label}
                    </Text>
                  </View>

                  {maintenanceDetailsData?.Maintenance.MaintenanceType && (
                    <View
                      style={[
                        styles.tag,
                        {
                          backgroundColor: getStatus(maintenanceDetailsData?.Maintenance.MaintenanceType.name).color,
                        },
                      ]}
                    >
                      <Text style={styles.tagText}>
                        {getStatus(maintenanceDetailsData?.Maintenance.MaintenanceType.name).label}
                      </Text>
                    </View>
                  )}

                  {maintenanceDetailsData?.inProgress && (
                    <View style={[styles.tag, { backgroundColor: getStatus("Em execução").color }]}>
                      <Text style={styles.tagText}>{getStatus("Em execução").label}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Categoria</Text>
                  <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.Category.name}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Elemento</Text>
                  <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.element}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Atividade</Text>
                  <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.activity}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Responsável</Text>
                  <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.responsible}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fonte</Text>
                  <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.source}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Observação da manutenção</Text>
                  <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.observation}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Instruções</Text>
                  <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance?.instructions[0]?.name}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Periodicidade</Text>
                  {maintenanceDetailsData?.Maintenance.MaintenanceType.name === "common" ? (
                    <Text style={styles.infoValue}>
                      {maintenanceDetailsData?.Maintenance.frequency ?? ""}{" "}
                      {(maintenanceDetailsData?.Maintenance.frequency ?? 0 > 1)
                        ? maintenanceDetailsData?.Maintenance.FrequencyTimeInterval.pluralLabel === "anos" &&
                          maintenanceDetailsData?.Maintenance.frequency === 1
                          ? "ano"
                          : maintenanceDetailsData?.Maintenance.FrequencyTimeInterval.pluralLabel
                        : maintenanceDetailsData?.Maintenance.FrequencyTimeInterval.singularLabel}
                    </Text>
                  ) : (
                    <Text style={styles.infoValue}>-</Text>
                  )}
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Data de notificação</Text>
                  <Text style={styles.infoValue}>{formatDate(maintenanceDetailsData?.notificationDate || "")}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Data de vencimento</Text>
                  <Text style={styles.infoValue}>{formatDate(maintenanceDetailsData?.dueDate || "")}</Text>
                </View>

                {maintenanceDetailsData?.resolutionDate && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Data de conclusão</Text>
                    <Text style={styles.infoValue}>{formatDate(maintenanceDetailsData?.resolutionDate)}</Text>
                  </View>
                )}

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>Fornecedor</Text>

                  {supplierData ? (
                    <TouchableOpacity
                      onPress={() => handleUnlinkMaintenanceSupplier(supplierData.id)}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.unlinkText}>Desvincular</Text>
                      <Icon name="link" size={16} color="#fff" style={styles.unlinkIcon} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.unlinkButton} onPress={toggleSupplierModal}>
                      <Text style={styles.unlinkText}>Vincular</Text>
                      <Icon name="link" size={16} color="#fff" style={styles.unlinkIcon} />
                    </TouchableOpacity>
                  )}
                </View>

                {supplierData ? (
                  <View style={styles.supplierContainer}>
                    <View style={styles.supplierAvatar}>
                      <Image
                        source={{
                          uri: supplierData.image,
                        }}
                        style={styles.supplierAvatarImage}
                      />
                    </View>
                    <View style={styles.supplierDetails}>
                      <Text style={styles.supplierName}>{supplierData.name}</Text>
                      <Text style={styles.supplierEmail}>
                        <Icon name="mail" size={12} /> {supplierData.email || "-"}
                      </Text>
                      <Text style={styles.supplierWebsite}>
                        <Icon name="phone" size={12} /> {supplierData.phone || "-"}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.supplierContainer}>
                    <View style={styles.supplierDetails}>
                      <Text style={styles.supplierEmail}>Nenhum fornecedor encontrado.</Text>
                    </View>
                  </View>
                )}

                {/* Enviar Comentário */}
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
                          setUploadedFiles((prev) => [
                            ...prev,
                            {
                              originalName: uploadedFile.name,
                              url: uploadedFile.url,
                              type: uploadedFile.type,
                            },
                          ]);
                        }
                      }}
                    >
                      <Icon name="upload" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.commentButton}
                      onPress={() => {
                        const maintenanceId = maintenanceDetailsData?.id;

                        if (maintenanceId && comment) {
                          handleCreateMaintenanceActivity(userId, maintenanceId, comment, uploadedFiles);
                        } else {
                          console.error("Maintenance ID ou Supplier ID está indefinido.");
                        }
                      }}
                    >
                      <Icon name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Históricos */}
                <Text style={styles.sectionHeaderText}>Históricos</Text>

                {/* Botões de filtro */}
                <View style={styles.historyTabs}>
                  <TouchableOpacity
                    style={[styles.historyTabButton, activeTab === "comment" && styles.activeTabButton]}
                    onPress={() => setActiveTab("comment")}
                  >
                    <Text style={[styles.historyTabText, activeTab === "comment" && styles.activeTabText]}>
                      Comentários
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.historyTabButton, activeTab === "notification" && styles.activeTabButton]}
                    onPress={() => setActiveTab("notification")}
                  >
                    <Text style={[styles.historyTabText, activeTab === "notification" && styles.activeTabText]}>
                      Notificações
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de históricos */}
                <View style={styles.historyList}>
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                    {filteredData && filteredData?.length >= 1 ? (
                      filteredData.map((item) => (
                        <View key={item.id} style={styles.historyItem}>
                          <View style={styles.historyIconContainer}>
                            <Icon name="activity" size={20} color="#ffffff" />
                          </View>

                          <View style={styles.historyContent}>
                            <Text style={styles.historyTitle}>{item.title}</Text>
                            <Text style={styles.historyTimestamp}>{formatDate(item.createdAt)}</Text>
                            <Text style={styles.historyDescription}>{item.content}</Text>

                            {/* Renderizar imagens, se existirem */}
                            {item.images && item.images.length > 0 && (
                              <View style={styles.imagePreviewContainer}>
                                {item.images.map((image) => (
                                  <View key={image.id} style={styles.imageItem}>
                                    <Image source={{ uri: image.url }} style={styles.previewImage} />
                                    <Text
                                      style={styles.imageName}
                                      numberOfLines={1} // Limita a uma linha
                                      ellipsizeMode="tail"
                                    >
                                      {image.name}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                        </View>
                      ))
                    ) : (
                      <Text>Não há registros no momento</Text>
                    )}
                  </ScrollView>
                </View>

                {/* Relato */}
                <View style={styles.container}>
                  {/* Input de Custo */}
                  {maintenanceDetailsData?.MaintenancesStatus.name !== "completed" ? (
                    maintenanceDetailsData?.MaintenancesStatus.name !== "overdue" ? (
                      <>
                        <Text style={styles.sectionHeaderText}>Custo</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="R$ 0,00"
                          value={cost}
                          onChangeText={(text) => handleChangeCost(text)}
                          keyboardType="numeric"
                        />
                      </>
                    ) : (
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Custo</Text>
                        <Text style={styles.infoValue}>{`R$ ${cost}`}</Text>
                      </View>
                    )
                  ) : (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Custo</Text>
                      <Text style={styles.infoValue}>{`R$ ${cost}`}</Text>
                    </View>
                  )}

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

                  {/* Botões de ação */}
                  {maintenanceDetailsData?.MaintenancesStatus.name !== "completed" &&
                    maintenanceDetailsData?.MaintenancesStatus.name !== "overdue" && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.secondaryActionButton}
                          onPress={handleChangeMaintenanceProgress}
                        >
                          <Text style={styles.secondaryActionButtonText}>
                            {maintenanceDetailsData?.inProgress ? "Parar" : "Iniciar"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.secondaryActionButton}
                          onPress={() => {
                            if (maintenanceDetailsData?.id) {
                              handleSaveMaintenanceProgress(
                                userId,
                                maintenanceDetailsData?.id,
                                convertCostToInteger(cost),
                                files,
                                images,
                              );
                            }
                          }}
                        >
                          <Text style={styles.secondaryActionButtonText}>Salvar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.primaryActionButton}
                          onPress={() => {
                            if (maintenanceDetailsData?.id) {
                              Alert.alert("Confirmar Ação", "Tem certeza de que deseja finalizar a manutenção?", [
                                {
                                  text: "Cancelar",
                                  style: "cancel",
                                },
                                {
                                  text: "Sim",
                                  onPress: () => {
                                    handleFinishMaintenance(
                                      userId,
                                      maintenanceDetailsData?.id,
                                      convertCostToInteger(cost),
                                      files,
                                      images,
                                    );
                                  },
                                },
                              ]);
                            }
                          }}
                        >
                          <Text style={styles.actionButtonText}>Finalizar manutenção</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              </ScrollView>
            </SafeAreaView>
          </KeyboardAvoidingView>
          {/* Película e indicador de carregamento */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ff3535" />
              <Text style={styles.loadingText}>Aguarde</Text>
            </View>
          )}
        </View>
      )}
    </>
  );
};
