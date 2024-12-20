import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
  BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/Feather";
import {
  MaintenanceDetails,
  MaintenanceHistoryActivities,
  Supplier,
  UploadedFile,
} from "../../types"; // Certifique-se de ajustar o caminho para o tipo
import { styles } from "./styles"; // Ajuste o caminho para os estilos
import { getStatus } from "../../utils/getStatus"; // Ajuste o caminho para a função getStatus
import { getMaintenanceDetailsByMaintenanceId } from "../../services/getMaintenanceDetailsByMaintenanceId";
import { getSuppliersByMaintenanceId } from "../../services/getSuppliersByMaintenanceId";
import { formatDate } from "../../utils/formatDate";
import SupplierModal from "../supplierModal";
import { removeSuppliersFromMaintenance } from "../../services/removeSuppliersFromMaintenance";
import { getHistoryActivitiesFromMaintenance } from "../../services/getHistoryActivitiesFromMaintenance";
import { addMaintenanceHistoryActivity } from "../../services/addMaintenanceHistoryActivity";
import { uploadFile } from "../../services/uploadFile";
import { saveProgressInMaintenance } from "../../services/saveProgressInMaintenance";
import { startStopMaintenanceProgress } from "../../services/startStopMaintenanceProgress";
import { finishMaintenance } from "../../services/finishMaintenance";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MaintenanceDetailsModalProps {
  visible: boolean;
  maintenance: MaintenanceDetails | null;
  onClose: () => void;
}

const MaintenanceDetailsModal: React.FC<MaintenanceDetailsModalProps> = ({
  visible,
  maintenance,
  onClose,
}) => {
  if (!maintenance) return null; // Evita renderizar o modal se nenhum dado for passado
  const [maintenanceDetailsData, setMaintenanceDetailsData] =
    useState<MaintenanceDetails>();
  const [suppliersData, setSuppliersData] = useState<Supplier[]>([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [comment, setComment] = useState(" ");
  const [activeTab, setActiveTab] = useState<"comment" | "notification">(
    "comment"
  );
  const [historyActivitiesData, setHistoryActivitiesData] =
    useState<MaintenanceHistoryActivities>();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const filteredData =
    historyActivitiesData?.maintenanceHistoryActivities.filter(
      (item) => item.type === activeTab
    );
  const [syndicNanoId, setSyndicNanoId] = useState("");
  const [buildingNanoId, setBuildingNanoId] = useState("");
  const [cost, setCost] = useState("0,00"); // Estado para o custo
  const [files, setFiles] = useState<
    { originalName: string; url: string; name: string }[]
  >([]); // Estado para os arquivos
  const [images, setImages] = useState<
    { originalName: string; url: string; name: string }[]
  >([]); // Estado para as imagens

  const handleFileUpload = async (): Promise<void> => {
    try {
      // Abrir o seletor de documentos para selecionar um arquivo
      const fileResult = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Permite todos os tipos de arquivo. Use 'image/*' para apenas imagens
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (fileResult.canceled) {
        console.log("Nenhum arquivo selecionado.");
        return;
      }

      const { uri, name, mimeType } = fileResult.assets[0];

      const file = {
        uri,
        name,
        type: mimeType || "application/octet-stream", // Ajuste o tipo conforme necessário
      };

      // Fazer upload do arquivo
      const fileUrl = await uploadFile(file);

      if (fileUrl) {
        setFiles((prev) => [
          ...prev,
          { originalName: file.name, url: fileUrl, name: file.name },
        ]);
        console.log("Upload Concluído", "Arquivo enviado com sucesso!");
      } else {
        console.error("Falha no upload do arquivo.");
      }
    } catch (error) {
      console.error("Erro ao selecionar ou enviar o arquivo:", error);
      console.log("Erro", "Não foi possível processar o arquivo.");
    }
  };

  const handleImageUpload = async (): Promise<void> => {
    try {
      // Solicitar permissões para acessar a galeria
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        console.log(
          "Permissão necessária",
          "Você precisa permitir o acesso à galeria."
        );
        return;
      }

      // Abrir a galeria para selecionar uma imagem
      const imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1, // Qualidade máxima da imagem
      });

      if (imageResult.canceled) {
        console.log("Nenhuma imagem selecionada.");
        return;
      }

      const image = {
        uri: imageResult.assets[0].uri,
        type: "image/jpeg", // Ajuste o tipo conforme necessário
        name: `photo-${Date.now()}.jpg`, // Nome único para a imagem
      };

      // Fazer upload da imagem
      const fileUrl = await uploadFile(image);

      if (fileUrl) {
        setImages((prev) => [
          ...prev,
          { originalName: image.name, url: fileUrl, name: image.name },
        ]);
        console.log("Upload Concluído", `Imagem enviada com sucesso!`);
      } else {
        console.error("Falha no upload da imagem.");
      }
    } catch (error) {
      console.error("Erro ao selecionar ou enviar a imagem:", error);
      console.log("Erro", "Não foi possível processar a imagem.");
    }
  };

  const convertCostToInteger = (cost: string) => {
    // Substitui a vírgula por ponto para lidar com decimais
    let normalizedCost = cost.replace(",", ".");

    // Converte a string em um número de ponto flutuante
    let floatCost = parseFloat(normalizedCost);

    // Verifica se a conversão foi bem-sucedida
    if (isNaN(floatCost)) {
      floatCost = 0;
    }

    // Multiplica por 100 para converter em centavos e arredonda
    let integerCost = Math.round(floatCost * 100);

    return integerCost;
  };

  const removeItem = (list: any[], setList: any, index: number) => {
    const updatedList = [...list];
    updatedList.splice(index, 1); // Remove o item pelo índice
    setList(updatedList);
  };

  const addHistoryActivity = async (
    syndicNanoId: string,
    maintenanceId: string,
    comment: string,
    images?: any
  ) => {
    await addMaintenanceHistoryActivity(
      maintenanceId,
      syndicNanoId,
      comment,
      images
    ).then(async () => {
      setComment("");
      setUploadedFiles([]);
      await fetchData();
    });
  };

  const handleUpload = async (): Promise<void> => {
    try {
      // Solicitar permissões para acessar a galeria
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        console.log(
          "Permissão necessária",
          "Você precisa permitir o acesso à galeria."
        );
        return;
      }

      // Abrir a galeria para selecionar uma imagem
      const imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1, // Qualidade máxima da imagem
      });

      if (imageResult.canceled) {
        console.log("Nenhuma imagem selecionada.");
        return;
      }

      const image = {
        uri: imageResult.assets[0].uri,
        type: "image/jpeg", // Ajuste o tipo conforme necessário
        name: `photo-${Date.now()}.jpg`, // Nome único para a imagem
      };

      // Fazer upload da imagem
      const fileUrl = await uploadFile(image);

      if (fileUrl) {
        setUploadedFiles((prev) => [
          ...prev,
          { originalName: image.name, url: fileUrl },
        ]);
        console.log("Upload Concluído", `Imagem enviada com sucesso!`);
      } else {
        console.error("Falha no upload da imagem.");
      }
    } catch (error) {
      console.error("Erro ao selecionar ou enviar a imagem:", error);
      console.log("Erro", "Não foi possível processar a imagem.");
    }
  };

  const toogleSupplierModal = async () => {
    setShowSupplierModal((prev) => !prev);
    await fetchData();
  };

  const saveProgress = async (
    syndicNanoId: string,
    maintenanceId: string,
    cost: number,
    files: any,
    images: any
  ) => {
    await saveProgressInMaintenance(
      maintenanceId,
      cost,
      syndicNanoId,
      files,
      images
    ).then(async () => {
      setFiles([]);
      setImages([]);
      setCost("");
      await fetchData();
    });
  };

  const handleFinishMaintenance = async (
    syndicNanoId: string,
    maintenanceId: string,
    cost: number,
    files: any,
    images: any
  ) => {
    await finishMaintenance(
      maintenanceId,
      cost,
      syndicNanoId,
      files,
      images
    ).then(async () => {
      setFiles([]);
      setImages([]);
      setCost("");
      await fetchData();
    });
  };

  const fetchData = async () => {
    try {
      const syndicNanoId = await AsyncStorage.getItem("syndicNanoId");
      const buildingNanoId = await AsyncStorage.getItem("buildingNanoId");

      if (syndicNanoId && buildingNanoId) {
        setSyndicNanoId(syndicNanoId);
        setBuildingNanoId(buildingNanoId);

        const [maintenanceData, suppliersData, historyActivitiesData] =
          await Promise.all([
            getMaintenanceDetailsByMaintenanceId(maintenance.id),
            getSuppliersByMaintenanceId(maintenance.id),
            getHistoryActivitiesFromMaintenance(maintenance.id, syndicNanoId),
          ]);

        if (maintenanceData) {
          setMaintenanceDetailsData(maintenanceData);

          if (maintenanceData.MaintenanceReportProgress.length) {
            setCost(
              String(
                maintenanceData.MaintenanceReportProgress[0].cost / 100
              ).replace(".", ",")
            );
          }

          if (maintenanceData.MaintenanceReport.length) {
            setCost(
              String(
                maintenanceData.MaintenanceReport[0].cost || 0 / 100
              ).replace(".", ",")
            );
          }

          if (maintenanceData.MaintenanceReportProgress.length) {
            setFiles(
              maintenanceData.MaintenanceReportProgress[0].ReportAnnexesProgress
            );
          }

          if (maintenanceData.MaintenanceReport.length) {
            setFiles(maintenanceData.MaintenanceReport[0].ReportAnnexes);
          }

          if (maintenanceData.MaintenanceReportProgress.length) {
            setImages(
              maintenanceData.MaintenanceReportProgress[0].ReportImagesProgress
            );
          }

          if (maintenanceData.MaintenanceReport.length) {
            setImages(maintenanceData.MaintenanceReport[0].ReportImages);
          }
        }

        if (suppliersData) {
          setSuppliersData(suppliersData.suppliers || []);
        }

        if (historyActivitiesData) {
          setHistoryActivitiesData(historyActivitiesData);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    } finally {
      // possível loading pode ser implementado
    }
  };

  const removeSupplier = async (
    syndicNanoId: string,
    maintenanceId: string | undefined,
    supplierId: string
  ) => {
    if (maintenanceId && syndicNanoId && supplierId) {
      try {
        await removeSuppliersFromMaintenance(
          maintenanceId,
          syndicNanoId,
          supplierId
        );
        console.log("Fornecedor removido com sucesso");

        // Recarregar os dados do modal
        await fetchData();
      } catch (error) {
        console.error("Erro ao remover fornecedor:", error);
      }
    } else {
      console.error("Maintenance ID ou Supplier ID está indefinido.");
    }
  };

  const startStopProgress = async (
    syndicNanoId: string,
    maintenanceId: string | undefined,
    inProgressChange: boolean
  ) => {
    if (maintenanceId) {
      await startStopMaintenanceProgress(
        maintenanceId,
        inProgressChange,
        syndicNanoId
      ).then(async () => {
        await fetchData();
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SupplierModal
        visible={showSupplierModal}
        onClose={toogleSupplierModal}
        maintenanceId={maintenance.id}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.modalFullContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enviar relato</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Icon name="x" size={32} color="#b21d1d" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            nestedScrollEnabled={true}
          >
            <Text style={styles.modalBuildingName}>
              {maintenanceDetailsData?.Building.name}
            </Text>

            <View style={styles.modalTags}>
              <View
                style={[
                  styles.tag,
                  { backgroundColor: getStatus(maintenance.status).color },
                ]}
              >
                <Text style={styles.tagText}>
                  {getStatus(maintenance.status).label}
                </Text>
              </View>

              {maintenanceDetailsData?.Maintenance.MaintenanceType && (
                <View
                  style={[
                    styles.tag,
                    {
                      backgroundColor: getStatus(
                        maintenanceDetailsData?.Maintenance.MaintenanceType.name
                      ).color,
                    },
                  ]}
                >
                  <Text style={styles.tagText}>
                    {
                      getStatus(
                        maintenanceDetailsData?.Maintenance.MaintenanceType.name
                      ).label
                    }
                  </Text>
                </View>
              )}

              {maintenanceDetailsData?.inProgress && (
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: getStatus("Em execução").color },
                  ]}
                >
                  <Text style={styles.tagText}>
                    {getStatus("Em execução").label}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Categoria</Text>
              <Text style={styles.modalInfoValue}>
                {maintenanceDetailsData?.Maintenance.Category.name}
              </Text>
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Elemento</Text>
              <Text style={styles.modalInfoValue}>
                {maintenanceDetailsData?.Maintenance.element}
              </Text>
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Atividade</Text>
              <Text style={styles.modalInfoValue}>
                {maintenanceDetailsData?.Maintenance.activity}
              </Text>
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Responsável</Text>
              <Text style={styles.modalInfoValue}>
                {maintenanceDetailsData?.Maintenance.responsible}
              </Text>
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Fonte</Text>
              <Text style={styles.modalInfoValue}>
                {maintenanceDetailsData?.Maintenance.source}
              </Text>
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>
                Observação da manutenção
              </Text>
              <Text style={styles.modalInfoValue}>
                {maintenanceDetailsData?.Maintenance.observation}
              </Text>
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Instruções</Text>
              <Text style={styles.modalInfoValue}>
                {maintenanceDetailsData?.Maintenance.instructions}
              </Text>
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Periodicidade</Text>
              <Text style={styles.modalInfoValue}>
                {maintenanceDetailsData?.Maintenance.period}
              </Text>
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Data de notificação</Text>
              <Text style={styles.modalInfoValue}>
                {formatDate(maintenanceDetailsData?.notificationDate || "")}
              </Text>
            </View>

            <View style={styles.modalInfoRow}>
              <Text style={styles.modalInfoLabel}>Data de vencimento</Text>
              <Text style={styles.modalInfoValue}>
                {formatDate(maintenanceDetailsData?.dueDate || "")}
              </Text>
            </View>

            {maintenanceDetailsData?.resolutionDate && (
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalInfoLabel}>Data de conclusão</Text>
                <Text style={styles.modalInfoValue}>
                  {formatDate(maintenanceDetailsData?.resolutionDate)}
                </Text>
              </View>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Fornecedor</Text>

              {suppliersData.length >= 1 && (
                <TouchableOpacity
                  style={styles.unlinkButton}
                  onPress={() => {
                    const maintenanceId = maintenanceDetailsData?.id;
                    const supplierId = suppliersData[0]?.id;

                    if (maintenanceId && supplierId) {
                      removeSupplier(syndicNanoId, maintenanceId, supplierId);
                    } else {
                      console.error(
                        "Maintenance ID ou Supplier ID está indefinido."
                      );
                    }
                  }}
                >
                  <Text style={styles.unlinkText}>Desvincular</Text>
                  <Icon
                    name="link"
                    size={16}
                    color="#fff"
                    style={styles.unlinkIcon}
                  />
                </TouchableOpacity>
              )}

              {!suppliersData.length && (
                <TouchableOpacity
                  style={styles.unlinkButton}
                  onPress={toogleSupplierModal}
                >
                  <Text style={styles.unlinkText}>Vincular</Text>
                  <Icon
                    name="link"
                    size={16}
                    color="#fff"
                    style={styles.unlinkIcon}
                  />
                </TouchableOpacity>
              )}
            </View>

            {suppliersData.length >= 1 ? (
              suppliersData.map((suppliers) => (
                <View style={styles.supplierContainer}>
                  <View style={styles.supplierAvatar}>
                    <Image
                      source={{
                        uri: suppliers.image,
                      }}
                      style={styles.supplierAvatarImage}
                    />
                  </View>
                  <View style={styles.supplierDetails}>
                    <Text style={styles.supplierName}>{suppliers.name}</Text>
                    <Text style={styles.supplierEmail}>
                      <Icon name="mail" size={12} /> {suppliers.email || "-"}
                    </Text>
                    <Text style={styles.supplierWebsite}>
                      <Icon name="phone" size={12} /> {suppliers.phone || "-"}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.supplierContainer}>
                <View style={styles.supplierDetails}>
                  <Text style={styles.supplierEmail}>
                    Nenhum fornecedor encontrado.
                  </Text>
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
                      <Text style={styles.uploadedFileName}>
                        {file.originalName}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => {
                        setUploadedFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
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
                  onPress={handleUpload}
                >
                  <Icon name="upload" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.commentButton}
                  onPress={() => {
                    const maintenanceId = maintenanceDetailsData?.id;

                    if (maintenanceId && comment) {
                      addHistoryActivity(
                        syndicNanoId,
                        maintenanceId,
                        comment,
                        uploadedFiles
                      );
                    } else {
                      console.error(
                        "Maintenance ID ou Supplier ID está indefinido."
                      );
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
                style={[
                  styles.historyTabButton,
                  activeTab === "comment" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("comment")}
              >
                <Text
                  style={[
                    styles.historyTabText,
                    activeTab === "comment" && styles.activeTabText,
                  ]}
                >
                  Comentários
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.historyTabButton,
                  activeTab === "notification" && styles.activeTabButton,
                ]}
                onPress={() => setActiveTab("notification")}
              >
                <Text
                  style={[
                    styles.historyTabText,
                    activeTab === "notification" && styles.activeTabText,
                  ]}
                >
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
                        <Text style={styles.historyTimestamp}>
                          {formatDate(item.createdAt)}
                        </Text>
                        <Text style={styles.historyDescription}>
                          {item.content}
                        </Text>

                        {/* Renderizar imagens, se existirem */}
                        {item.images && item.images.length > 0 && (
                          <View style={styles.imagePreviewContainer}>
                            {item.images.map((image) => (
                              <View key={image.id} style={styles.imageItem}>
                                <Image
                                  source={{ uri: image.url }}
                                  style={styles.previewImage}
                                />
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
              {maintenanceDetailsData?.MaintenancesStatus.name !==
              "completed" ? (
                maintenanceDetailsData?.MaintenancesStatus.name !==
                "overdue" ? (
                  <>
                    <Text style={styles.sectionHeaderText}>Custo</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="R$ 0,00"
                      value={cost}
                      onChangeText={(text) => setCost(text)} // Adiciona a máscara monetária
                      keyboardType="numeric"
                    />
                  </>
                ) : (
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalInfoLabel}>Custo</Text>
                    <Text style={styles.modalInfoValue}>{`R$ ${cost}`}</Text>
                  </View>
                )
              ) : (
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Custo</Text>
                  <Text style={styles.modalInfoValue}>{`R$ ${cost}`}</Text>
                </View>
              )}

              {/* Botão de anexar arquivos */}
              <Text style={styles.sectionHeaderText}>Anexos</Text>
              <View style={styles.uploadContainer}>
                {maintenanceDetailsData?.MaintenancesStatus.name !==
                  "completed" &&
                  maintenanceDetailsData?.MaintenancesStatus.name !==
                    "overdue" && (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleFileUpload}
                    >
                      <Icon name="paperclip" size={24} color="#c62828" />
                    </TouchableOpacity>
                  )}
                <View style={styles.fileList}>
                  {files.map((file, index) => (
                    <TouchableOpacity onPress={() => Linking.openURL(file.url)}>
                      <View key={index} style={styles.fileItem}>
                        <Text
                          style={styles.fileName}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {file.originalName}
                        </Text>
                        {maintenanceDetailsData?.MaintenancesStatus.name !==
                          "completed" &&
                          maintenanceDetailsData?.MaintenancesStatus.name !==
                            "overdue" && (
                            <TouchableOpacity
                              onPress={() => removeItem(files, setFiles, index)}
                            >
                              <Icon
                                name="x"
                                size={16}
                                color="#fff"
                                style={styles.deleteIcon}
                              />
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
                {maintenanceDetailsData?.MaintenancesStatus.name !==
                  "completed" &&
                  maintenanceDetailsData?.MaintenancesStatus.name !==
                    "overdue" && (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleImageUpload}
                    >
                      <Icon name="image" size={24} color="#c62828" />
                    </TouchableOpacity>
                  )}
                <View style={styles.fileList}>
                  {images.map((image, index) => (
                    <View key={index} style={styles.fileItem}>
                      <TouchableOpacity
                        onPress={() => Linking.openURL(image.url)}
                      >
                        <Image
                          source={{ uri: image.url }}
                          style={styles.previewImage}
                        />
                      </TouchableOpacity>
                      {maintenanceDetailsData?.MaintenancesStatus.name !==
                        "completed" &&
                        maintenanceDetailsData?.MaintenancesStatus.name !==
                          "overdue" && (
                          <TouchableOpacity
                            onPress={() => removeItem(images, setImages, index)}
                          >
                            <Icon
                              name="x"
                              size={16}
                              color="#fff"
                              style={styles.deleteIcon}
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Botões de ação */}
              {maintenanceDetailsData?.MaintenancesStatus.name !==
                "completed" &&
                maintenanceDetailsData?.MaintenancesStatus.name !==
                  "overdue" && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.secondaryActionButton}
                      onPress={() => {
                        startStopProgress(
                          syndicNanoId,
                          maintenanceDetailsData?.id,
                          !maintenanceDetailsData?.inProgress
                        );
                      }}
                    >
                      <Text style={styles.secondaryActionButtonText}>
                        {maintenanceDetailsData?.inProgress
                          ? "Parar"
                          : "Iniciar"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryActionButton}
                      onPress={() => {
                        if (maintenanceDetailsData?.id) {
                          saveProgress(
                            syndicNanoId,
                            maintenanceDetailsData?.id,
                            convertCostToInteger(cost),
                            files,
                            images
                          );
                        }
                      }}
                    >
                      <Text style={styles.secondaryActionButtonText}>
                        Salvar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.primaryActionButton}
                      onPress={() => {
                        if (maintenanceDetailsData?.id) {
                          Alert.alert(
                            "Confirmar Ação",
                            "Tem certeza de que deseja finalizar a manutenção?",
                            [
                              {
                                text: "Cancelar",
                                style: "cancel",
                              },
                              {
                                text: "Sim",
                                onPress: () => {
                                  handleFinishMaintenance(
                                    syndicNanoId,
                                    maintenanceDetailsData?.id,
                                    convertCostToInteger(cost),
                                    files,
                                    images
                                  );
                                },
                              },
                            ]
                          );
                        }
                      }}
                    >
                      <Text style={styles.actionButtonText}>
                        Finalizar manutenção
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MaintenanceDetailsModal;
