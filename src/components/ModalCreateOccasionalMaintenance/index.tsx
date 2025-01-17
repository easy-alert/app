import { useEffect, useState } from "react";

import Icon from "react-native-vector-icons/Feather";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { getCategoriesByBuildingNanoId } from "../../services/getCategoriesByBuildingNanoId";
import { createOccasionalMaintenance } from "../../services/createOccasionalMaintenance";

import { styles } from "./styles";

import type {
  ICategory,
  IOccasionalMaintenanceData,
  IOccasionalMaintenanceType,
} from "../../types";
import { Dropdown } from "react-native-element-dropdown";

interface IModalCreateOccasionalMaintenance {
  visible: boolean;
  buildingNanoId: string;
  syndicNanoId: string;
  handleCreateMaintenanceModal: (modalState: boolean) => void;
}

interface IHandleSetOccasionalMaintenanceData {
  primaryKey: keyof IOccasionalMaintenanceData;
  value: string | number | boolean;
  secondaryKey?: string;
}

interface IHandleCreateOccasionalMaintenance {
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  inProgress?: boolean;
}

function ModalCreateOccasionalMaintenance({
  visible,
  buildingNanoId,
  syndicNanoId,
  handleCreateMaintenanceModal,
}: IModalCreateOccasionalMaintenance) {
  const [occasionalMaintenance, setOccasionalMaintenance] =
    useState<IOccasionalMaintenanceData>({
      buildingId: buildingNanoId,

      element: "",
      activity: "",
      responsible: "",
      executionDate: "",
      inProgress: false,
      priorityName: "",

      categoryData: {
        id: "",
        name: "",
      },

      reportData: {
        cost: "R$ 0,00",
        observation: "",
        files: [],
        images: [],
      },
    });

  const [categories, setCategories] = useState<ICategory[]>([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const responsibleArray = [
    { id: "1", name: "Equipe de manutenção local" },
    { id: "2", name: "Equipe capacitada" },
    { id: "3", name: "Equipe Especializada" },
  ];

  const handleOccasionalMaintenanceDataChange = ({
    primaryKey,
    value,
    secondaryKey,
  }: IHandleSetOccasionalMaintenanceData) => {
    if (secondaryKey) {
      setOccasionalMaintenance((prevState) => {
        const primaryData =
          typeof prevState[primaryKey] === "object" &&
          prevState[primaryKey] !== null
            ? prevState[primaryKey]
            : {};

        return {
          ...prevState,
          [primaryKey]: {
            ...primaryData,
            [secondaryKey]: value,
          },
        };
      });

      return;
    }

    setOccasionalMaintenance((prevState) => ({
      ...prevState,
      [primaryKey]: value,
    }));
  };

  const handleDatePicker = (modalState: boolean) => {
    setShowDatePicker(modalState);
  };

  const handleCloseModal = () => {
    handleCreateMaintenanceModal(false);
    setOccasionalMaintenance({
      buildingId: buildingNanoId,

      element: "",
      activity: "",
      responsible: "",
      executionDate: "",
      inProgress: false,
      priorityName: "",

      categoryData: {
        id: "",
        name: "",
      },

      reportData: {
        cost: "R$ 0,00",
        observation: "",
        files: [],
        images: [],
      },
    });
  };

  const handleGetCategoriesByBuildingNanoId = async () => {
    setLoading(true);

    try {
      const categories = await getCategoriesByBuildingNanoId({
        buildingNanoId,
      });

      setCategories(categories);
    } catch (error) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOccasionalMaintenance = async ({
    occasionalMaintenanceType,
    inProgress = false,
  }: IHandleCreateOccasionalMaintenance) => {
    setLoading(true);

    const reportDataBody =
      occasionalMaintenanceType === "finished"
        ? occasionalMaintenance.reportData
        : {
            cost: "R$ 0,00",
            observation: "",
            files: [],
            images: [],
          };

    const occasionalMaintenanceBody = {
      ...occasionalMaintenance,
      buildingId: buildingNanoId,
      reportData: reportDataBody,
      inProgress,
    };

    try {
      const response = await createOccasionalMaintenance({
        origin: "Mobile",
        syndicNanoId,
        occasionalMaintenanceType,
        occasionalMaintenanceBody,
      });

      if (response?.ServerMessage.statusCode === 200) {
      }
    } catch (error) {}

    setLoading(false);
  };

  useEffect(() => {
    handleGetCategoriesByBuildingNanoId();
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.modalFullContainer}>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              locale="pt-BR"
              is24Hour={true}
              value={new Date()}
              onChange={(event, selectedDate) => {
                handleDatePicker(false);
                handleOccasionalMaintenanceDataChange({
                  primaryKey: "executionDate",
                  value: selectedDate?.toISOString() || "",
                });
              }}
            />
          )}

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Manutenção avulsa</Text>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={handleCloseModal}
            >
              <Icon name="x" size={28} color="#b21d1d" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalForm}>
            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Categoria *</Text>

              <View style={styles.modalPicker}>
                <Dropdown
                  placeholder="Selecione a categoria"
                  placeholderStyle={{ color: "gray" }}
                  style={{ paddingHorizontal: 12 }}
                  iconColor="#b21d1d"
                  data={categories}
                  maxHeight={300}
                  labelField="name"
                  valueField="id"
                  value={occasionalMaintenance.categoryData.name}
                  onChange={(value) => {
                    const selectedCategory = categories.find(
                      (category) => category.name === value
                    );

                    if (!selectedCategory) return;

                    handleOccasionalMaintenanceDataChange({
                      primaryKey: "categoryData",
                      value: selectedCategory.id || "",
                      secondaryKey: "id",
                    });

                    handleOccasionalMaintenanceDataChange({
                      primaryKey: "categoryData",
                      value: selectedCategory.name || "",
                      secondaryKey: "name",
                    });
                  }}
                />
              </View>
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Elemento *</Text>
              <TextInput
                placeholder="Informe o elemento"
                placeholderTextColor="gray"
                style={styles.modalInput}
                value={occasionalMaintenance.element}
                onChangeText={(text) =>
                  handleOccasionalMaintenanceDataChange({
                    primaryKey: "element",
                    value: text,
                  })
                }
              />
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Atividade *</Text>

              <TextInput
                placeholder="Informe o elemento"
                placeholderTextColor="gray"
                style={styles.modalInput}
                value={occasionalMaintenance.activity}
                onChangeText={(text) =>
                  handleOccasionalMaintenanceDataChange({
                    primaryKey: "activity",
                    value: text,
                  })
                }
              />
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Responsável *</Text>

              <View style={styles.modalPicker}>
                <Dropdown
                  placeholder="Selecione o responsável"
                  style={{ paddingHorizontal: 12 }}
                  placeholderStyle={{ color: "gray" }}
                  iconColor="#b21d1d"
                  data={responsibleArray}
                  maxHeight={300}
                  labelField="name"
                  valueField="name"
                  value={occasionalMaintenance.responsible}
                  onChange={(value) =>
                    handleOccasionalMaintenanceDataChange({
                      primaryKey: "responsible",
                      value: value as string,
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Prioridade *</Text>

              <View style={styles.modalPicker}>
                <Dropdown
                  placeholder="Selecione a prioridade"
                  placeholderStyle={{ color: "gray" }}
                  style={{ paddingHorizontal: 12 }}
                  iconColor="#b21d1d"
                  data={[
                    {
                      id: "low",
                      name: "Baixa",
                    },
                    {
                      id: "medium",
                      name: "Média",
                    },
                    {
                      id: "high",
                      name: "Alta",
                    },
                  ]}
                  maxHeight={300}
                  labelField="name"
                  valueField="id"
                  value={occasionalMaintenance.priorityName}
                  onChange={(value) =>
                    handleOccasionalMaintenanceDataChange({
                      primaryKey: "priorityName",
                      value: value as string,
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.modalInputContainer}>
              <Text style={styles.modalInputLabel}>Data de execução *</Text>

              <View>
                <TextInput
                  style={styles.modalInput}
                  value={new Date(
                    occasionalMaintenance.executionDate
                  ).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  placeholder="dd/mm/aaaa"
                  editable={false}
                />

                <Icon
                  name="calendar"
                  size={24}
                  color="#b21d1d"
                  style={{ position: "absolute", right: 16, top: 8 }}
                  onPress={() => handleDatePicker(true)}
                />
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleCreateOccasionalMaintenance({
                  occasionalMaintenanceType: "pending",
                });
              }}
            >
              <Text style={styles.modalSecondaryLabel}>Criar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalSecondaryLabel}>Iniciar execução</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ ...styles.modalButton, backgroundColor: "#b21d1d" }}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonLabel}>Criar finalizada</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default ModalCreateOccasionalMaintenance;
