import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { DateTimeInput } from "@/components/DateTimeInput";
import { Dropdown } from "@/components/Dropdown";
import { LabelInput } from "@/components/LabelInput";
import { useAuth } from "@/contexts/AuthContext";
import type { Navigation } from "@/routes/navigation";
import { createOccasionalMaintenance } from "@/services/createOccasionalMaintenance";
import { getCategories } from "@/services/getCategories";
import type { ICategory } from "@/types/ICategory";
import type { IOccasionalMaintenanceType } from "@/types/IOccasionalMaintenanceType";
import { IUser } from "@/types/IUser";

import { styles } from "./styles";

const responsibles = [
  { id: "1", name: "Equipe de manutenção local" },
  { id: "2", name: "Equipe capacitada" },
  { id: "3", name: "Equipe Especializada" },
];

const priorities = [
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
];

type IBuilding = IUser["UserBuildingsPermissions"][0];

interface IHandleCreateOccasionalMaintenance {
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  inProgress?: boolean;
}

// TODO: Não está validando o preenchimento do formulário
// TODO: Alterar o loading de criação para ser diferente do carregamento da tela

export const Form = () => {
  const { userId } = useAuth();
  const navigation = useNavigation<Navigation>();

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [element, setElement] = useState<string>("");
  const [activity, setActivity] = useState<string>("");
  const [selectedResponsible, setSelectedResponsible] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [executionDate, setExecutionDate] = useState<string>("");

  useEffect(() => {
    const handleGetCategories = async () => {
      try {
        setLoadingCategories(true);
        const categories = await getCategories();

        setCategories(categories);
      } finally {
        setLoadingCategories(false);
      }
    };

    const getBuildings = async () => {
      try {
        const storageBuildings = await AsyncStorage.getItem("buildingsList");

        if (!storageBuildings) {
          throw new Error("Nenhum prédio encontrado.");
        }

        setBuildings(JSON.parse(storageBuildings));
      } catch (error) {
        console.error("Erro ao carregar a lista de prédios:", error);
        Alert.alert("Erro", "Não foi possível carregar os prédios.");
        navigation.goBack();
      }
    };

    handleGetCategories();
    getBuildings();
  }, [navigation]);

  const handleCreateOccasionalMaintenance = async ({
    occasionalMaintenanceType,
    inProgress = false,
  }: IHandleCreateOccasionalMaintenance) => {
    setLoading(true);

    const occasionalMaintenanceBody = {
      buildingId: selectedBuildingId,

      element,
      activity,
      responsible: selectedResponsible,
      executionDate,
      inProgress,
      priorityName: selectedPriority,

      categoryData: {
        id: selectedCategoryId,
        name: selectedCategoryName,
      },

      reportData: {
        cost: "R$ 0,00",
        observation: "",
        files: [],
        images: [],
      },
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
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ff3535" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <LabelInput label="Edificação *">
        <Dropdown
          placeholder="Selecione a edificação"
          data={buildings.map((building) => ({
            id: building.Building.id,
            name: building.Building.name,
          }))}
          labelField="name"
          valueField="id"
          value={selectedBuildingId}
          onChange={(item) => {
            setSelectedBuildingId(item.id);
          }}
        />
      </LabelInput>

      <LabelInput label="Categoria *">
        <Dropdown
          placeholder="Selecione a categoria"
          data={categories.map((category) => ({
            id: category.id!,
            name: category.name!,
          }))}
          labelField="name"
          valueField="id"
          value={selectedCategoryId}
          onChange={(item) => {
            setSelectedCategoryId(item.id);
            setSelectedCategoryName(item.name);
          }}
          loading={loadingCategories}
        />
      </LabelInput>

      <LabelInput label="Elemento *" placeholder="Informe o elemento" value={element} onChangeText={setElement} />

      <LabelInput label="Atividade *" placeholder="Ex: Troca de lâmpada" value={activity} onChangeText={setActivity} />

      <LabelInput label="Responsável *">
        <Dropdown
          placeholder="Selecione o responsável"
          data={responsibles}
          labelField="name"
          valueField="name"
          value={selectedResponsible}
          onChange={(value) => setSelectedResponsible(value.name)}
        />
      </LabelInput>

      <LabelInput label="Prioridade *">
        <Dropdown
          placeholder="Selecione a prioridade"
          data={priorities}
          labelField="name"
          valueField="id"
          value={selectedPriority}
          onChange={(value) => setSelectedPriority(value.id)}
        />
      </LabelInput>

      <LabelInput label="Data de execução *">
        <DateTimeInput
          onSelectDate={(selectedDate) => setExecutionDate(selectedDate.toISOString())}
          value={
            executionDate
              ? new Date(executionDate).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })
              : undefined
          }
        />
      </LabelInput>

      <View style={styles.footer}>
        <SecondaryButton
          label={"Criar em execução"}
          onPress={() =>
            handleCreateOccasionalMaintenance({
              occasionalMaintenanceType: "pending",
              inProgress: true,
            })
          }
          style={styles.footerButton}
        />

        <PrimaryButton
          label={"Criar manutenção"}
          onPress={() =>
            handleCreateOccasionalMaintenance({
              occasionalMaintenanceType: "pending",
            })
          }
          style={styles.footerButton}
        />
      </View>
    </View>
  );
};
