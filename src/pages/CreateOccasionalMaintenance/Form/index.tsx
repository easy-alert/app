import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { useEffect, useState } from "react";

import { useNavigation } from "@react-navigation/native";

import { getCategoriesByBuildingId } from "@/services/getCategoriesByBuildingId";
import { createOccasionalMaintenance } from "@/services/createOccasionalMaintenance";
import { useAuth } from "@/contexts/AuthContext";
import { DateTimeInput } from "@/components/DateTimeInput";
import { Dropdown } from "@/components/Dropdown";
import { LabelInput } from "@/components/LabelInput";

import { styles } from "./styles";

import type { Navigation } from "@/routes/navigation";
import type { IOccasionalMaintenanceData } from "@/types/IOccasionalMaintenanceData";
import type { ICategory } from "@/types/ICategory";
import type { IOccasionalMaintenanceType } from "@/types/IOccasionalMaintenanceType";

interface IHandleSetOccasionalMaintenanceData {
  primaryKey: keyof IOccasionalMaintenanceData;
  value: string | number | boolean;
  secondaryKey?: string;
}

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

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

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
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // TODO: o loading é pra quando está criando, mas aqui ta usando de uma maneira que é pra quando está carregando
  // alterar para aparecer um loading só no lugar do formulário
  if (loading) {
    return <ActivityIndicator size="large" color="#ff3535" style={styles.loading} />;
  }

  const responsible = [
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

  return (
    <View style={styles.container}>
      <LabelInput label="Categoria *">
        <Dropdown
          placeholder="Selecione a categoria"
          data={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
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
      </LabelInput>

      <LabelInput
        label="Elemento *"
        placeholder="Informe o elemento"
        value={occasionalMaintenance.element}
        onChangeText={(text) =>
          handleOccasionalMaintenanceDataChange({
            primaryKey: "element",
            value: text,
          })
        }
      />

      <LabelInput
        label="Atividade *"
        placeholder="Informe o elemento"
        value={occasionalMaintenance.activity}
        onChangeText={(text) =>
          handleOccasionalMaintenanceDataChange({
            primaryKey: "activity",
            value: text,
          })
        }
      />

      <LabelInput label="Responsável *">
        <Dropdown
          placeholder="Selecione o responsável"
          data={responsible}
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
      </LabelInput>

      <LabelInput label="Prioridade *">
        <Dropdown
          placeholder="Selecione a prioridade"
          data={priorities}
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
      </LabelInput>

      <LabelInput label="Data de execução *">
        <DateTimeInput
          onSelectDate={(selectedDate) => {
            handleOccasionalMaintenanceDataChange({
              primaryKey: "executionDate",
              value: selectedDate?.toISOString() || "",
            });
          }}
          style={styles.dateTimeInput}
          value={
            occasionalMaintenance.executionDate
              ? new Date(occasionalMaintenance.executionDate).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })
              : new Date().toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })
          }
        />
      </LabelInput>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            handleCreateOccasionalMaintenance({
              occasionalMaintenanceType: "pending",
              inProgress: true,
            });
          }}
        >
          <Text style={styles.secondaryButtonLabel}>Criar em execução</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            handleCreateOccasionalMaintenance({
              occasionalMaintenanceType: "pending",
            });
          }}
        >
          <Text style={styles.primaryButtonLabel}>Criar manutenção</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
