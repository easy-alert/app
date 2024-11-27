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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import {
  MaintenanceDetails,
  MaintenanceHistoryActivities,
  Supplier,
} from "../../types"; // Certifique-se de ajustar o caminho para o tipo
import { styles } from "./styles"; // Ajuste o caminho para os estilos
import { getStatus } from "../../utils/getStatus"; // Ajuste o caminho para a função getStatus
import { getMaintenanceDetailsByMaintenanceId } from "../../services/getMaintenanceDetailsByMaintenanceId";
import { getSuppliersByMaintenanceId } from "../../services/getSuppliersByMaintenanceId";
import { formatDate } from "../../utils/formatDate";
import SupplierModal from "../supplierModal";
import { removeSuppliersFromMaintenance } from "../../services/removeSuppliersFromMaintenance";
import { getHistoryActivitiesFromMaintenance } from "../../services/getHistoryActivitiesFromMaintenance";

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
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState<"comment" | "notification">(
    "comment"
  );
  const [historyActivitiesData, setHistoryActivitiesData] =
    useState<MaintenanceHistoryActivities>();

  const filteredData =
    historyActivitiesData?.maintenanceHistoryActivities.filter(
      (item) => item.type === activeTab
    );

  const toogleSupplierModal = async () => {
    setShowSupplierModal((prev) => !prev);
    await fetchData();
  };

  const fetchData = async () => {
    try {
      const [maintenanceData, suppliersData, historyActivitiesData] =
        await Promise.all([
          getMaintenanceDetailsByMaintenanceId(maintenance.id),
          getSuppliersByMaintenanceId(maintenance.id),
          getHistoryActivitiesFromMaintenance(maintenance.id, "Fr8aLc-krzQn"),
        ]);

      if (maintenanceData) {
        setMaintenanceDetailsData(maintenanceData);
      }

      if (suppliersData) {
        setSuppliersData(suppliersData.suppliers || []);
      }

      if (historyActivitiesData) {
        setHistoryActivitiesData(historyActivitiesData);
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
              <Icon name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
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
              <Text style={styles.sectionHeaderText}>Fornecedores</Text>
              {suppliersData.length >= 1 && (
                <TouchableOpacity
                  style={styles.unlinkButton}
                  onPress={() => {
                    const maintenanceId = maintenanceDetailsData?.id;
                    const supplierId = suppliersData[0]?.id;

                    if (maintenanceId && supplierId) {
                      removeSupplier("Fr8aLc-krzQn", maintenanceId, supplierId);
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
              <View style={styles.commentButtons}>
                <TouchableOpacity
                  style={styles.commentButton}
                  onPress={() => {}} // Botão vazio
                >
                  <Icon name="upload" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.commentButton}
                  onPress={() => {}} // Botão vazio
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
              <ScrollView style={{ maxHeight: 200 }}>
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
                      </View>
                    </View>
                  ))
                ) : (
                  <Text>Não há registros no momento</Text>
                )}
              </ScrollView>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MaintenanceDetailsModal;
