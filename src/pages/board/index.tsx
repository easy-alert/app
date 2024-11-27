import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Navbar from "../../components/navbar";
import { styles } from "../board/styles";
import { MaintenanceDetails, KanbanColumn } from "../../types";
import { getStatus } from "../../utils/getStatus";
import { getMaintenancesBySyndicNanoId } from "../../services/getMaintenancesBySyndicNanoId";
import MaintenanceDetailsModal from "../../components/maintenancesDetailsModal";
import { getCompanyLogoByBuildingNanoId } from "../../services/getCompanyLogoByBuildingNanoId";

export const Board = () => {
  const [kanbanData, setKanbanData] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<MaintenanceDetails | null>(null);

  const [logo, setLogo] = useState("");

  useEffect(() => {
    const getKanbanData = async () => {
      setLoading(true); // Define o estado de carregamento antes da chamada
      const data = await getMaintenancesBySyndicNanoId("Fr8aLc-krzQn");
      const logo = await getCompanyLogoByBuildingNanoId("H7q61JMw0-yR");

      if (data) {
        setKanbanData(data.kanban || []);
      }
      if (logo) {
        setLogo(logo);
      }
      setLoading(false); // Finaliza o estado de carregamento
    };

    getKanbanData();
  }, []);

  const openModal = (maintenance: MaintenanceDetails) => {
    setSelectedMaintenance(maintenance);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMaintenance(null);
  };

  return (
    <>
      <Navbar logoUrl={logo} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={{ marginTop: 20 }}
        />
      ) : kanbanData.length > 0 ? (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {kanbanData.map((column) => (
            <View key={column.status} style={styles.statusContainer}>
              <Text style={styles.statusTitle}>{column.status}</Text>
              <ScrollView
                style={styles.cardsContainer}
                nestedScrollEnabled={true}
              >
                {column.maintenances.map((maintenance) => (
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
                          backgroundColor: getStatus(maintenance.status).color,
                        },
                      ]}
                    >
                      <Text style={styles.tagText}>
                        {getStatus(maintenance.status).label}
                      </Text>
                    </View>

                    <Text style={styles.cardTitle}>{maintenance.element}</Text>

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
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
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
