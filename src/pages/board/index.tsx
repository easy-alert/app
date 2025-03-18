import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/Feather";

import { useNavigation, useNavigationState } from "@react-navigation/native";

import { styles } from "./styles";

import type { KanbanColumn } from "@/types/IKanbanColumn";

import { Navbar } from "@/components/navbar";
import { getBuildingLogo } from "@/services/getBuildingLogo";
import { getMaintenancesKanban } from "@/services/getMaintenancesKanban";
import { formatDate } from "@/utils/formatDate";
import { getStatus } from "@/utils/getStatus";
import { processOfflineQueue, startPeriodicQueueProcessing } from "@/utils/processOfflineQueue";

export const Board = () => {
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state);

  const [kanbanData, setKanbanData] = useState<KanbanColumn[]>([]);

  const [userId, setUserId] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [logo, setLogo] = useState("");

  const [loading, setLoading] = useState(true);

  const [offlineCount, setOfflineCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  const handleGetKanbanData = async () => {
    setLoading(true);

    try {
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
          setLoading(false);
          setKanbanData(responseData.kanban || []);
        }
      } else {
        Alert.alert("Credenciais inválidas");
        // TODO: implementar pq o navigation nao tem o .replace
        // navigation.replace("Login"); // Após autenticar, redireciona para a tela principal
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("🚀 ~ handleGetKanbanData ~ error:", error);
    }
  };

  const handleGetBuildingLogo = async () => {
    try {
      const buildingId = await AsyncStorage.getItem("buildingId");

      if (!buildingId) {
        return;
      }

      const responseData = await getBuildingLogo({ buildingId });

      if (responseData) {
        setLogo(responseData.buildingLogo);
      }
    } catch (error) {
      console.error("🚀 ~ handleGetBuildingLogo ~ error:", error);
    }
  };

  const getOfflineQueueCount = async () => {
    const offlineQueueString = await AsyncStorage.getItem("offline_queue");
    const offlineQueue = offlineQueueString ? JSON.parse(offlineQueueString) : [];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (navigationState.routes[navigationState.index].name === "Board") {
      handleGetKanbanData();
      handleGetBuildingLogo();
    }
  }, [navigationState.index, navigationState.routes]);

  return (
    <>
      <Navbar logoUrl={logo} syndicNanoId={userId} buildingNanoId={buildingId} />

      {offlineCount > 0 && (
        <View style={{ padding: 10, backgroundColor: "#f8f9fa" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>
            {`Fila Offline: ${offlineCount} item(s)`}
          </Text>

          {isProcessing && <Text style={{ color: "green" }}>Processando dados da fila, aguarde...</Text>}
        </View>
      )}

      {!internetConnection && (
        <View style={{ padding: 10, backgroundColor: "#f8f9fa" }}>
          {!isProcessing && (
            <Text style={{ color: "green" }}>Você está offline, alguns serviços podem estar indisponíveis...</Text>
          )}
        </View>
      )}

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
                onPress={() =>
                  navigation.navigate("CreateOccasionalMaintenance", {
                    buildingId,
                    userId,
                  })
                }
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
            {kanbanData?.map((column) => (
              <View key={column.status} style={styles.statusContainer}>
                <Text style={styles.statusTitle}>{column.status}</Text>
                <ScrollView style={styles.cardsContainer} nestedScrollEnabled={true}>
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
                            navigation.navigate("MaintenanceDetails", {
                              maintenanceId: maintenance.id,
                              userId,
                            })
                          }
                        >
                          <View
                            style={[
                              styles.tag,
                              {
                                backgroundColor: getStatus(maintenance.type).color,
                              },
                            ]}
                          >
                            <Text style={styles.tagText}>{getStatus(maintenance.type).label}</Text>
                          </View>

                          {maintenance.status === "overdue" && (
                            <View
                              style={[
                                styles.tag,
                                {
                                  backgroundColor: getStatus(maintenance.status).color,
                                },
                              ]}
                            >
                              <Text style={styles.tagText}>{getStatus(maintenance.status).label}</Text>
                            </View>
                          )}

                          <Text style={styles.cardTitle}>{maintenance.element}</Text>

                          <Text style={styles.cardDescription}>{maintenance.activity}</Text>

                          {(maintenance.status === "completed" || maintenance.status === "overdue") && (
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
                      ),
                  )}
                </ScrollView>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <Text style={{ marginTop: 20, textAlign: "center" }}>Nenhum dado encontrado.</Text>
      )}
    </>
  );
};
