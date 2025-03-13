import { useEffect, useState } from "react";

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

import { Dropdown } from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

import { getCategoriesByBuildingId } from "../../services/getCategoriesByBuildingId";

import type { IHandleCreateOccasionalMaintenance } from "../../pages/board";
import type { ICategory, IOccasionalMaintenanceData } from "../../types";

interface IModalCreateOccasionalMaintenance {
  buildingId: string;
  visible: boolean;
  handleCreateMaintenanceModal: (modalState: boolean) => void;
  handleCreateOccasionalMaintenance: ({
    occasionalMaintenance,
    occasionalMaintenanceType,
    inProgress,
  }: IHandleCreateOccasionalMaintenance) => void;
}

interface IHandleSetOccasionalMaintenanceData {
  primaryKey: keyof IOccasionalMaintenanceData;
  value: string | number | boolean;
  secondaryKey?: string;
}

export const ModalCreateOccasionalMaintenance: React.FC<IModalCreateOccasionalMaintenance> = ({
  buildingId,
  visible,
  handleCreateOccasionalMaintenance,
  handleCreateMaintenanceModal,
}) => {
  const [occasionalMaintenance, setOccasionalMaintenance] = useState<IOccasionalMaintenanceData>({
    buildingId: buildingId,

    element: "",
    activity: "",
    responsible: "",
    executionDate: new Date().toISOString(),
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
          typeof prevState[primaryKey] === "object" && prevState[primaryKey] !== null ? prevState[primaryKey] : {};

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
      buildingId: buildingId,

      element: "",
      activity: "",
      responsible: "",
      executionDate: new Date().toISOString(),
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
    try {
      const categories = await getCategoriesByBuildingId();

      setCategories(categories);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    if (visible) {
      handleGetCategoriesByBuildingNanoId();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <SafeAreaView style={styles.modalFullContainer}>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            display="inline"
            onConfirm={(selectedDate) => {
              handleDatePicker(false);
              handleOccasionalMaintenanceDataChange({
                primaryKey: "executionDate",
                value: selectedDate?.toISOString() || "",
              });
            }}
            onCancel={() => handleDatePicker(false)}
            themeVariant={"light"}
          />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Manutenção avulsa</Text>

            <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
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
                  data={
                    categories.map((category) => ({
                      id: category.id,
                      name: category.name,
                    })) as any
                  }
                  maxHeight={300}
                  labelField="name"
                  valueField="id"
                  value={occasionalMaintenance.categoryData.id}
                  onChange={(item) => {
                    handleOccasionalMaintenanceDataChange({
                      primaryKey: "categoryData",
                      value: item.id || "",
                      secondaryKey: "id",
                    });

                    handleOccasionalMaintenanceDataChange({
                      primaryKey: "categoryData",
                      value: item.name || "",
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
                      value: value.name as string,
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
                      value: value.id as string,
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
                  value={
                    occasionalMaintenance.executionDate
                      ? new Date(occasionalMaintenance.executionDate).toLocaleDateString("pt-BR", {
                          timeZone: "UTC",
                        })
                      : new Date().toLocaleDateString("pt-BR", {
                          timeZone: "UTC",
                        })
                  }
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
            {/* <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleCreateOccasionalMaintenance({
                  occasionalMaintenanceType: "pending",
                });
              }}
            >
              <Text style={styles.modalSecondaryLabel}>Criar</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                handleCreateOccasionalMaintenance({
                  occasionalMaintenance,
                  occasionalMaintenanceType: "pending",
                  inProgress: true,
                });
              }}
            >
              <Text style={styles.modalSecondaryLabel}>Criar em execução</Text>
            </TouchableOpacity>

            {
              // <TouchableOpacity
              //   style={{ ...styles.modalButton, backgroundColor: "#b21d1d" }}
              //   onPress={handleCloseModal}
              // >
              //   <Text style={styles.modalButtonLabel}>Criar finalizada</Text>
              // </TouchableOpacity>
            }

            <TouchableOpacity
              style={{ ...styles.modalButton, backgroundColor: "#b21d1d" }}
              onPress={() => {
                handleCreateOccasionalMaintenance({
                  occasionalMaintenance,
                  occasionalMaintenanceType: "pending",
                });
              }}
            >
              <Text style={styles.modalButtonLabel}>Criar manutenção</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
