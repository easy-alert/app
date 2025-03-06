import React, { useState, useEffect } from "react";

import Icon from "react-native-vector-icons/Feather";
import {
  Alert,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import { getMaintenancesKanban } from "../../services/getMaintenancesKanban";
import { getBuildingLogo } from "../../services/getBuildingLogo";

import Navbar from "../../components/navbar";
import MaintenanceDetailsModal from "../../components/maintenancesDetailsModal";
import ModalCreateOccasionalMaintenance from "../../components/ModalCreateOccasionalMaintenance";

import {
  processOfflineQueue,
  startPeriodicQueueProcessing,
} from "../../utils/processOffilineQueue";
import { getStatus } from "../../utils/getStatus";
import { formatDate } from "../../utils/formatDate";

import { styles } from "../board/styles";

import type { MaintenanceDetails, KanbanColumn } from "../../types";

export interface IMaintenanceFilter {
  buildings: string[];
  status: string[];
  categories: string[];
  users: string[];
  priorityName: string;
  startDate?: string;
  endDate?: string;
}

export const Board = ({ navigation }: any) => {
  const [kanbanData, setKanbanData] = useState<KanbanColumn[]>([]);
  const [selectedMaintenanceId, setSelectedMaintenanceId] =
    useState<string>("");

  const [userId, setUserId] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [logo, setLogo] = useState("");

  const [maintenanceDetailsModal, setMaintenanceDetailsModal] = useState(false);
  const [createMaintenanceModal, setCreateMaintenanceModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const [offlineCount, setOfflineCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  const handleCreateMaintenanceModal = (modalState: boolean) => {
    setCreateMaintenanceModal(modalState);
  };

  const openMaintenanceDetailsModal = (maintenance: MaintenanceDetails) => {
    setSelectedMaintenanceId(maintenance.id);
    setMaintenanceDetailsModal(true);
  };

  const handleGetKanbanData = async () => {
    setLoading(true); // Define o estado de carregamento antes da chamada

    const userId = await AsyncStorage.getItem("userId");
    const buildingId = await AsyncStorage.getItem("buildingId");
    const buildingName = await AsyncStorage.getItem("buildingName");

    if (userId && buildingId && buildingName) {
      setUserId(userId);
      setBuildingId(buildingId);
      setBuildingName(buildingName);

      const responseData = await getMaintenancesKanban({
        userId,
        filter: {
          buildings: [buildingId],
          status: [],
          categories: [],
          users: [],
          priorityName: "",
          endDate: "2100-01-01",
          startDate: "1900-01-01",
        },
      });

      if (responseData) {
        setKanbanData(responseData.kanban || []);
      }
    } else {
      Alert.alert("Credenciais inválidas");
      navigation.replace("Login"); // Após autenticar, redireciona para a tela principal
    }
  };

  const handleGetBuildingLogo = async () => {
    const buildingId = await AsyncStorage.getItem("buildingId");

    if (!buildingId) {
      return;
    }

    const responseData = await getBuildingLogo({ buildingId });

    if (responseData) {
      setLogo(responseData.buildingLogo);
    }
  };

  const closeMaintenanceDetailsModal = () => {
    setSelectedMaintenanceId("");
    setRefresh(!refresh);
    setMaintenanceDetailsModal(false);
    setLoading(false);
  };

  const getOfflineQueueCount = async () => {
    const offlineQueueString = await AsyncStorage.getItem("offline_queue");
    const offlineQueue = offlineQueueString
      ? JSON.parse(offlineQueueString)
      : [];
    setOfflineCount(offlineQueue.length);
  };

  const processQueueOnReconnect = () => {
    NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        setInternetConnection(true);
        setIsProcessing(true);
        await processOfflineQueue(); // Processa a fila
        setIsProcessing(false);
        await getOfflineQueueCount(); // Atualiza o contador
      } else {
        setInternetConnection(false);
      }
    });
  };

  useEffect(() => {
    const stopProcessing = startPeriodicQueueProcessing();

    return () => stopProcessing(); // Limpa o intervalo ao desmontar o componente
  }, []);

  useEffect(() => {
    getOfflineQueueCount(); // Atualiza o contador ao montar o componente
    processQueueOnReconnect(); // Observa reconexões de internet
  }, []);

  useEffect(() => {
    setLoading(true);

    try {
      handleGetKanbanData();
      handleGetBuildingLogo();
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  return (
    <>
      <Navbar
        logoUrl={logo}
        syndicNanoId={userId}
        buildingNanoId={buildingId}
      />

      {offlineCount > 0 && (
        <View style={{ padding: 10, backgroundColor: "#f8f9fa" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
            {`Fila Offline: ${offlineCount} item(s)`}
          </Text>

          {isProcessing && (
            <Text style={{ color: "green" }}>
              Processando dados da fila, aguarde...
            </Text>
          )}
        </View>
      )}

      {!internetConnection && (
        <View style={{ padding: 10, backgroundColor: "#f8f9fa" }}>
          {!isProcessing && (
            <Text style={{ color: "green" }}>
              Você está offline, alguns serviços podem estar indisponíveis...
            </Text>
          )}
        </View>
      )}

      <MaintenanceDetailsModal
        maintenanceId={selectedMaintenanceId}
        userId={userId}
        buildingId={buildingId}
        visible={maintenanceDetailsModal}
        onClose={closeMaintenanceDetailsModal}
      />

      <ModalCreateOccasionalMaintenance
        visible={createMaintenanceModal}
        buildingNanoId={buildingId}
        syndicNanoId={userId}
        handleCreateMaintenanceModal={handleCreateMaintenanceModal}
        getKanbanData={handleGetKanbanData}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ff3535"
          style={{ alignContent: "center", justifyContent: "center", flex: 1 }}
        />
      ) : kanbanData.length > 0 ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 6,
              marginVertical: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {buildingName}
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("Building")}
                style={{
                  marginLeft: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon name="repeat" size={24} color="#b21d1d" />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                onPress={() => handleCreateMaintenanceModal(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#333333",
                  }}
                >
                  Avulsa
                </Text>
                <Icon name="plus" size={24} color="#b21d1d" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {kanbanData.map((column) => (
              <View key={column.status} style={styles.statusContainer}>
                <Text style={styles.statusTitle}>{column.status}</Text>
                <ScrollView
                  style={styles.cardsContainer}
                  nestedScrollEnabled={true}
                >
                  {column.maintenances.map(
                    (maintenance) =>
                      !maintenance.cantReportExpired && (
                        <TouchableOpacity
                          key={maintenance.id}
                          style={[
                            styles.card,
                            {
                              borderLeftColor: getStatus(column.status).color,
                              borderLeftWidth: 9,
                            }, // Cor da borda esquerda
                          ]}
                          onPress={() =>
                            openMaintenanceDetailsModal(maintenance)
                          }
                        >
                          <View
                            style={[
                              styles.tag,
                              {
                                backgroundColor: getStatus(maintenance.type)
                                  .color,
                              },
                            ]}
                          >
                            <Text style={styles.tagText}>
                              {getStatus(maintenance.type).label}
                            </Text>
                          </View>

                          {maintenance.status === "overdue" && (
                            <View
                              style={[
                                styles.tag,
                                {
                                  backgroundColor: getStatus(maintenance.status)
                                    .color,
                                },
                              ]}
                            >
                              <Text style={styles.tagText}>
                                {getStatus(maintenance.status).label}
                              </Text>
                            </View>
                          )}

                          <Text style={styles.cardTitle}>
                            {maintenance.element}
                          </Text>

                          <Text style={styles.cardDescription}>
                            {maintenance.activity}
                          </Text>

                          {(maintenance.status === "completed" ||
                            maintenance.status === "overdue") && (
                            <Text
                              style={[
                                styles.cardsContainer,
                                {
                                  color: "#34b53a",
                                },
                              ]}
                            >
                              {`Concluída em ${formatDate(maintenance.date)}`}
                            </Text>
                          )}

                          {maintenance.label && (
                            <Text
                              style={[
                                styles.cardFooter,
                                {
                                  color: getStatus(maintenance.status).color,
                                },
                              ]}
                            >
                              {maintenance.label}
                            </Text>
                          )}
                        </TouchableOpacity>
                      )
                  )}
                </ScrollView>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <Text style={{ marginTop: 20, textAlign: "center" }}>
          Nenhum dado encontrado.
        </Text>
      )}
    </>
  );
};
