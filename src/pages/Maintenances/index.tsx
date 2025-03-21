import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather";

import { useNavigation, useNavigationState } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import { getBuildingLogo } from "@/services/getBuildingLogo";
import { getMaintenancesKanban } from "@/services/getMaintenancesKanban";
import { formatDate } from "@/utils/formatDate";
import { getStatus } from "@/utils/getStatus";
import { useAuth } from "@/contexts/AuthContext";

import { Navbar } from "./Navbar";

import { styles } from "./styles";

import { OfflineData } from "./OfflineData";

import type { IKanbanColumn } from "@/types/IKanbanColumn";
import type { Navigation, RouteList } from "@/routes/navigation";

export const Maintenances = () => {
  const navigation = useNavigation<Navigation>();
  const navigationState = useNavigationState((state) => state);

  const { userId, logout } = useAuth();

  const [kanbanData, setKanbanData] = useState<IKanbanColumn[]>([]);

  const [buildingName, setBuildingName] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [logo, setLogo] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGetKanbanData = async () => {
      setLoading(true);

      try {
        const buildingId = await AsyncStorage.getItem("buildingId");
        const buildingName = await AsyncStorage.getItem("buildingName");

        if (!buildingId || !buildingName) {
          Alert.alert("Credenciais inválidas");
          await logout();
          return;
        }

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

    if ((navigationState.routes[navigationState.index].name as RouteList) === "Maintenances") {
      handleGetKanbanData();
      handleGetBuildingLogo();
    }
  }, [logout, navigationState.index, navigationState.routes, userId]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <SafeAreaView style={styles.navbarContainer} edges={["top"]}>
        <Navbar logoUrl={logo} buildingNanoId={buildingId} />
      </SafeAreaView>

      <OfflineData />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ff3535"
          style={{ alignContent: "center", justifyContent: "center", flex: 1 }}
        />
      ) : kanbanData.length > 0 ? (
        <View style={{ flex: 1 }}>
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
                onPress={() => navigation.navigate("Buildings")}
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
        </View>
      ) : (
        <Text style={{ marginTop: 20, textAlign: "center" }}>Nenhum dado encontrado.</Text>
      )}
    </SafeAreaView>
  );
};
