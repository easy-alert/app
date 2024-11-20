import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from "react-native";
import Navbar from "../../components/navbar";
import { styles } from "../board/styles";
import { ApiResponse, Maintenance, KanbanColumn } from "../../types";
import Icon from "react-native-vector-icons/Feather"; // Biblioteca de ícones Feather

export const Board = () => {
  const [kanbanData, setKanbanData] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<Maintenance | null>(null);

  const getColorByStatus = (status: string): string => {
    switch (status) {
      case "Vencidas":
        return "red"; // Vermelho
      case "expired":
        return "red"; // Vermelho
      case "Pendentes":
        return "orange"; // Amarelo
      case "Em execução":
        return "blue"; // Azul
      case "Concluídas":
        return "green"; // Verde
      default:
        return "gray"; // Cor padrão (caso o status seja inesperado)
    }
  };

  const fetchKanbanData = async () => {
    try {
      const response = await fetch(
        "https://easyalert-production.herokuapp.com/api/client/syndic/t4FsR52sQ08Q?year=&month=&status=&categoryId="
      );
      const data: ApiResponse = await response.json();
      setKanbanData(data?.kanban || []);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKanbanData();
  }, []);

  const openModal = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMaintenance(null);
  };

  return (
    <>
      <Navbar logoUrl="https://larguei.s3.us-west-2.amazonaws.com/LOGO_CASA_DO_SINDICO_AT-removebg-preview-1679072086766.png" />

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
              {/* Adiciona scroll vertical dentro de cada coluna */}
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
                        borderLeftColor: getColorByStatus(column.status),
                        borderLeftWidth: 5,
                      }, // Cor da borda esquerda
                    ]}
                    onPress={() => openModal(maintenance)}
                  >
                    {/* Etiqueta (por exemplo, "Preventiva") */}
                    <View
                      style={[
                        styles.tag,
                        { backgroundColor: getColorByStatus(column.status) },
                      ]}
                    >
                      <Text style={styles.tagText}>{column.status}</Text>
                    </View>

                    {/* Elemento do card */}
                    <Text style={styles.cardTitle}>{maintenance.element}</Text>

                    {/* Descrição */}
                    <Text style={styles.cardDescription}>
                      {maintenance.activity}
                    </Text>

                    {/* Informações adicionais (exemplo: "Atrasada há 112 dias") */}
                    <Text
                      style={[
                        styles.cardFooter,
                        { color: getColorByStatus(column.status) },
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

      {modalVisible && selectedMaintenance && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={closeModal}
        >
          <SafeAreaView style={styles.modalFullContainer}>
            {/* Header do Modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enviar relato</Text>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.modalCloseButton}
              >
                <Icon name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Conteúdo do Modal */}
            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* Nome do prédio */}
              <Text style={styles.modalBuildingName}>Apoena</Text>

              {/* Status (tags) */}
              <View style={styles.modalTags}>
                <View
                  style={[
                    styles.tag,
                    {
                      backgroundColor: getColorByStatus(
                        selectedMaintenance.status
                      ),
                    },
                  ]}
                >
                  <Text style={styles.tagText}>
                    {selectedMaintenance.status}
                  </Text>
                </View>
                <View style={[styles.tag, { backgroundColor: "blue" }]}>
                  <Text style={styles.tagText}>Preventiva</Text>
                </View>
              </View>

              {/* Informações principais */}
              {[
                { label: "Categoria", value: "Manutenções PCMO" },
                { label: "Elemento", value: selectedMaintenance.element },
                { label: "Atividade", value: selectedMaintenance.activity },
                { label: "Responsável", value: "Empresa filiada" },
                { label: "Fonte", value: "PCMO" },
                {
                  label: "Observação da manutenção",
                  value: "Manutenção realizada dentro do PCMO",
                },
                { label: "Instruções", value: "-" },
                { label: "Periodicidade", value: "A cada 2 meses" },
                { label: "Data de notificação", value: "01/11/2024" },
                { label: "Data de vencimento", value: "02/12/2024" },
              ].map((item, index) => (
                <View key={index} style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>{item.label}</Text>
                  <Text style={styles.modalInfoValue}>{item.value}</Text>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
};
