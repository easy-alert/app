import React, { useState, useEffect } from "react";

import {
  Alert,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getMaintenancesBySyndicNanoId } from "../../services/getMaintenancesBySyndicNanoId";
import { getCompanyLogoByBuildingNanoId } from "../../services/getCompanyLogoByBuildingNanoId";

import Navbar from "../../components/navbar";
import MaintenanceDetailsModal from "../../components/maintenancesDetailsModal";

import { getStatus } from "../../utils/getStatus";
import { formatDate } from "../../utils/formatDate";

import { styles } from "../board/styles";

import type { MaintenanceDetails, KanbanColumn } from "../../types";

export const Board = ({ navigation }: any) => {
  const [kanbanData, setKanbanData] = useState<KanbanColumn[]>([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<MaintenanceDetails | null>(null);

  const [buildingName, setBuildingName] = useState("");
  const [syndicNanoId, setSyndicNanoId] = useState("");
  const [buildingNanoId, setBuildingNanoId] = useState("");
  const [logo, setLogo] = useState("");

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const getKanbanData = async () => {
    setLoading(true); // Define o estado de carregamento antes da chamada
    
    const syndicNanoId = await AsyncStorage.getItem("syndicNanoId");
    const buildingNanoId = await AsyncStorage.getItem("buildingNanoId");
    const buildingName = await AsyncStorage.getItem("buildingName");

    if (syndicNanoId && buildingNanoId && buildingName) {
      setBuildingName(buildingName);
      setSyndicNanoId(syndicNanoId);
      setBuildingNanoId(buildingNanoId);

      const data = await getMaintenancesBySyndicNanoId(syndicNanoId);
      const logo = await getCompanyLogoByBuildingNanoId(buildingNanoId);

      if (data) {
        setKanbanData(data.kanban || []);
      }
      if (logo) {
        setLogo(logo);
      }
    } else {
      Alert.alert("Credenciais inválidas");
      navigation.replace("Login"); // Após autenticar, redireciona para a tela principal
    }

    setLoading(false); // Finaliza o estado de carregamento
  };

  const openModal = (maintenance: MaintenanceDetails) => {
    setSelectedMaintenance(maintenance);
    setModalVisible(true);
  };

  const closeModal = () => {
    getKanbanData();
    setModalVisible(false);
    setSelectedMaintenance(null);
  };

  useEffect(() => {
    getKanbanData();
  }, []);

  return (
    <>
      <Navbar
        logoUrl={logo}
        syndicNanoId={syndicNanoId}
        buildingNanoId={buildingNanoId}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={{ marginTop: 250 }}
        />
      ) : kanbanData.length > 0 ? (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 5,
              paddingTop: 10,
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
                onPress={() => navigation.navigate("Report")}
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
                          onPress={() => openModal(maintenance)}
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

      <MaintenanceDetailsModal
        visible={modalVisible}
        maintenance={selectedMaintenance}
        onClose={closeModal}
      />
    </>
  );
};
