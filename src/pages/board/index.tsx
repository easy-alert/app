import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Navbar from "../../components/navbar";
import { styles } from "../board/styles";
import { MaintenanceDetails, KanbanColumn } from "../../types";
import { getStatus } from "../../utils/getStatus";
import { getMaintenancesBySyndicNanoId } from "../../services/getMaintenancesBySyndicNanoId";
import MaintenanceDetailsModal from "../../components/maintenancesDetailsModal";
import { getCompanyLogoByBuildingNanoId } from "../../services/getCompanyLogoByBuildingNanoId";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Board = ({ navigation }: any) => {
  const [kanbanData, setKanbanData] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<MaintenanceDetails | null>(null);
  const [buildingName, setBuildingName] = useState("");
  const [syndicNanoId, setSyndicNanoId] = useState("");
  const [buildingNanoId, setBuildingNanoId] = useState("");

  const [logo, setLogo] = useState("");
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
  useEffect(() => {
    getKanbanData();
  }, []);

  const openModal = (maintenance: MaintenanceDetails) => {
    setSelectedMaintenance(maintenance);
    setModalVisible(true);
  };

  const closeModal = () => {
    getKanbanData();
    setModalVisible(false);
    setSelectedMaintenance(null);
  };

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
          <View>
            <Text
              style={{
                paddingHorizontal: 20,
                paddingTop: 20,
                fontSize: 20,
                fontWeight: "bold",
                color: "#333",
              }}
            >
              {buildingName}
            </Text>
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
                              borderLeftWidth: 5,
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

                          <Text
                            style={[
                              styles.cardFooter,
                              { color: getStatus(maintenance.status).color },
                            ]}
                          >
                            {maintenance.label}
                          </Text>
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
