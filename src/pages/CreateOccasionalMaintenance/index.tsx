import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
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

import { useNavigation, useRoute } from "@react-navigation/native";

import { styles } from "./styles";

import type { IOccasionalMaintenanceData } from "@/types/IOccasionalMaintenanceData";
import type { IOccasionalMaintenanceType } from "@/types/IOccasionalMaintenanceType";
import type { ICategory } from "@/types/ICategory";
import type { CreateOccasionalMaintenanceParams, Navigation } from "@/routes/navigation";

import { createOccasionalMaintenance } from "@/services/createOccasionalMaintenance";
import { getCategoriesByBuildingId } from "@/services/getCategoriesByBuildingId";

interface IHandleCreateOccasionalMaintenance {
  occasionalMaintenance: IOccasionalMaintenanceData;
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  inProgress?: boolean;
}

interface IHandleSetOccasionalMaintenanceData {
  primaryKey: keyof IOccasionalMaintenanceData;
  value: string | number | boolean;
  secondaryKey?: string;
}

export const CreateOccasionalMaintenance = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const { buildingId, userId } = route.params as CreateOccasionalMaintenanceParams;

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

  const handleCreateOccasionalMaintenance = async ({
    occasionalMaintenance,
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
      buildingId,
      inProgress,
      reportData: reportDataBody,
    };

    try {
      const responseData = await createOccasionalMaintenance({
        origin: "Mobile",
        userId,
        occasionalMaintenanceType,
        occasionalMaintenanceBody,
      });

      if (responseData?.ServerMessage.statusCode === 200) {
        navigation.replace("MaintenanceDetails", {
          maintenanceId: responseData.maintenance.id,
          userId,
        });
      }
    } finally {
      setLoading(false);
    }
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
    handleGetCategoriesByBuildingNanoId();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ff3535"
        style={{
          alignContent: "center",
          justifyContent: "center",
          flex: 1,
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={styles.fullContainer}>
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          display="inline"
          onConfirm={(selectedDate) => {
            setShowDatePicker(false);
            handleOccasionalMaintenanceDataChange({
              primaryKey: "executionDate",
              value: selectedDate?.toISOString() || "",
            });
          }}
          onCancel={() => setShowDatePicker(false)}
          themeVariant={"light"}
        />

        <View style={styles.header}>
          <Text style={styles.title}>Manutenção avulsa</Text>

          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Icon name="x" size={28} color="#b21d1d" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Categoria *</Text>

            <View style={styles.picker}>
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Elemento *</Text>
            <TextInput
              placeholder="Informe o elemento"
              placeholderTextColor="gray"
              style={styles.input}
              value={occasionalMaintenance.element}
              onChangeText={(text) =>
                handleOccasionalMaintenanceDataChange({
                  primaryKey: "element",
                  value: text,
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Atividade *</Text>

            <TextInput
              placeholder="Informe o elemento"
              placeholderTextColor="gray"
              style={styles.input}
              value={occasionalMaintenance.activity}
              onChangeText={(text) =>
                handleOccasionalMaintenanceDataChange({
                  primaryKey: "activity",
                  value: text,
                })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Responsável *</Text>

            <View style={styles.picker}>
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Prioridade *</Text>

            <View style={styles.picker}>
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Data de execução *</Text>

            <View>
              <TextInput
                style={styles.input}
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
                onPress={() => setShowDatePicker(true)}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleCreateOccasionalMaintenance({
                occasionalMaintenance,
                occasionalMaintenanceType: "pending",
                inProgress: true,
              });
            }}
          >
            <Text style={styles.secondaryLabel}>Criar em execução</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#b21d1d" }}
            onPress={() => {
              handleCreateOccasionalMaintenance({
                occasionalMaintenance,
                occasionalMaintenanceType: "pending",
              });
            }}
          >
            <Text style={styles.buttonLabel}>Criar manutenção</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
