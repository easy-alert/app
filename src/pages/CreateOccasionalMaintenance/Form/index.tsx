import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { DateTimeInput } from "@/components/DateTimeInput";
import { Dropdown } from "@/components/Dropdown";
import { LabelInput } from "@/components/LabelInput";
import { useAuth } from "@/contexts/AuthContext";
import type { Navigation } from "@/routes/navigation";
import { createOccasionalMaintenance } from "@/services/createOccasionalMaintenance";
import { getCategoriesByBuildingId } from "@/services/getCategoriesByBuildingId";
import type { ICategory } from "@/types/ICategory";
import type { IOccasionalMaintenanceType } from "@/types/IOccasionalMaintenanceType";

import { styles } from "./styles";

interface IHandleCreateOccasionalMaintenance {
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  inProgress?: boolean;
}

interface FormProps {
  buildingId: string;
}

export const Form = ({ buildingId }: FormProps) => {
  const { userId } = useAuth();
  const navigation = useNavigation<Navigation>();

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

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [element, setElement] = useState<string>("");
  const [activity, setActivity] = useState<string>("");
  const [selectedResponsible, setSelectedResponsible] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [executionDate, setExecutionDate] = useState<string>(new Date().toISOString());

  useEffect(() => {
    const handleGetCategoriesByBuildingNanoId = async () => {
      try {
        const categories = await getCategoriesByBuildingId();

        setCategories(categories);
      } catch {
        //
      }
    };

    handleGetCategoriesByBuildingNanoId();
  }, []);

  const handleCreateOccasionalMaintenance = async ({
    occasionalMaintenanceType,
    inProgress = false,
  }: IHandleCreateOccasionalMaintenance) => {
    setLoading(true);

    const occasionalMaintenanceBody = {
      buildingId,

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
        />
      </LabelInput>

      <LabelInput label="Elemento *" placeholder="Informe o elemento" value={element} onChangeText={setElement} />

      <LabelInput label="Atividade *" placeholder="Informe a atividade" value={activity} onChangeText={setActivity} />

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
          style={styles.dateTimeInput}
          value={new Date(executionDate).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
        />
      </LabelInput>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            handleCreateOccasionalMaintenance({
              occasionalMaintenanceType: "pending",
              inProgress: true,
            })
          }
        >
          <Text style={styles.secondaryButtonLabel}>Criar em execução</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            handleCreateOccasionalMaintenance({
              occasionalMaintenanceType: "pending",
            })
          }
        >
          <Text style={styles.primaryButtonLabel}>Criar manutenção</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
