import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";

import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { DateTimeInput } from "@/components/DateTimeInput";
import { Dropdown } from "@/components/Dropdown";
import { LabelInput } from "@/components/LabelInput";
import { useAuth } from "@/contexts/AuthContext";
import type { ProtectedNavigation } from "@/routes/navigation";
import { createOccasionalMaintenance } from "@/services/createOccasionalMaintenance";
import { getCategories } from "@/services/getCategories";
import type { ICategory } from "@/types/ICategory";
import type { IOccasionalMaintenanceType } from "@/types/IOccasionalMaintenanceType";
import { IUser } from "@/types/IUser";

import { styles } from "./styles";

const responsibles = [
  {
    name: "Equipe de manutenção local",
  },
  {
    name: "Equipe capacitada",
  },
  {
    name: "Equipe Especializada",
  },
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

const formSchema = z.object({
  buildingId: z.string().min(1, { message: "Edificação é obrigatória." }),
  categoryId: z.string().min(1, { message: "Categoria é obrigatória." }),
  element: z.string().min(1, { message: "Elemento é obrigatório." }),
  activity: z.string().min(1, { message: "Atividade é obrigatória." }),
  responsible: z.string().min(1, { message: "Responsável é obrigatório." }),
  priority: z.string().min(1, { message: "Prioridade é obrigatória." }),
  executionDate: z.string().min(1, { message: "Data de execução é obrigatória." }),
});

interface IHandleCreateOccasionalMaintenance {
  occasionalMaintenanceType: IOccasionalMaintenanceType;
  inProgress?: boolean;
  data: z.infer<typeof formSchema>;
}

export const Form = () => {
  const { userId } = useAuth();
  const navigation = useNavigation<ProtectedNavigation>();

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creatingInProgress, setCreatingInProgress] = useState(false);

  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
      categoryId: "",
      element: "",
      activity: "",
      responsible: "",
      priority: "",
      executionDate: "",
    },
  });

  const handleCreateOccasionalMaintenance = async ({
    data,
    occasionalMaintenanceType,
    inProgress = false,
  }: IHandleCreateOccasionalMaintenance) => {
    try {
      if (inProgress) {
        setCreatingInProgress(true);
      } else {
        setCreating(true);
      }

      const { buildingId, categoryId, element, activity, responsible, priority, executionDate } = data;

      const occasionalMaintenanceBody = {
        buildingId,

        element,
        activity,
        responsible,
        executionDate,
        inProgress,
        priorityName: priority,

        categoryData: {
          id: categoryId,
          name: categories.find((category) => category.id === categoryId)?.name!,
        },

        reportData: {
          cost: "R$ 0,00",
          observation: "",
          files: [],
          images: [],
        },
      };

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
      setCreating(false);
      setCreatingInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={form.control}
        name="buildingId"
        render={({ field }) => (
          <LabelInput label="Edificação *" error={form.formState.errors.buildingId?.message}>
            <Dropdown
              placeholder="Selecione a edificação"
              data={buildings.map((building) => ({
                id: building.Building.id,
                name: building.Building.name,
              }))}
              labelField="name"
              valueField="id"
              value={field.value}
              onChange={(item) => {
                field.onChange(item.id);
              }}
              disable={form.formState.isSubmitting}
            />
          </LabelInput>
        )}
      />

      <Controller
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <LabelInput label="Categoria *" error={form.formState.errors.categoryId?.message}>
            <Dropdown
              placeholder="Selecione a categoria"
              data={categories.map((category) => ({
                id: category.id!,
                name: category.name!,
              }))}
              labelField="name"
              valueField="id"
              value={field.value}
              onChange={(item) => {
                field.onChange(item.id);
              }}
              loading={loadingCategories}
              disable={form.formState.isSubmitting}
            />
          </LabelInput>
        )}
      />

      <Controller
        control={form.control}
        name="element"
        render={({ field }) => (
          <LabelInput
            label="Elemento *"
            error={form.formState.errors.element?.message}
            placeholder="Informe o elemento"
            value={field.value}
            onChangeText={field.onChange}
            editable={!form.formState.isSubmitting}
          />
        )}
      />

      <Controller
        control={form.control}
        name="activity"
        render={({ field }) => (
          <LabelInput
            label="Atividade *"
            error={form.formState.errors.activity?.message}
            placeholder="Ex: Troca de lâmpada"
            value={field.value}
            onChangeText={field.onChange}
            editable={!form.formState.isSubmitting}
          />
        )}
      />

      <Controller
        control={form.control}
        name="responsible"
        render={({ field }) => (
          <LabelInput label="Responsável *" error={form.formState.errors.responsible?.message}>
            <Dropdown
              placeholder="Selecione o responsável"
              data={responsibles}
              labelField="name"
              valueField="name"
              value={field.value}
              onChange={(value) => field.onChange(value.name)}
              disable={form.formState.isSubmitting}
            />
          </LabelInput>
        )}
      />

      <Controller
        control={form.control}
        name="priority"
        render={({ field }) => (
          <LabelInput label="Prioridade *" error={form.formState.errors.priority?.message}>
            <Dropdown
              placeholder="Selecione a prioridade"
              data={priorities}
              labelField="name"
              valueField="id"
              value={field.value}
              onChange={(value) => field.onChange(value.id)}
              disable={form.formState.isSubmitting}
            />
          </LabelInput>
        )}
      />

      <Controller
        control={form.control}
        name="executionDate"
        render={({ field }) => (
          <LabelInput label="Data de execução *" error={form.formState.errors.executionDate?.message}>
            <DateTimeInput
              onSelectDate={(selectedDate) => field.onChange(selectedDate.toISOString())}
              value={
                field.value
                  ? new Date(field.value).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })
                  : undefined
              }
              disabled={form.formState.isSubmitting}
            />
          </LabelInput>
        )}
      />

      <View style={styles.footer}>
        <SecondaryButton
          label={"Criar em execução"}
          onPress={form.handleSubmit((data) =>
            handleCreateOccasionalMaintenance({
              data,
              occasionalMaintenanceType: "pending",
              inProgress: true,
            }),
          )}
          style={styles.footerButton}
          loading={creatingInProgress}
          disabled={form.formState.isSubmitting}
        />

        <PrimaryButton
          label={"Criar manutenção"}
          onPress={form.handleSubmit((data) =>
            handleCreateOccasionalMaintenance({
              data,
              occasionalMaintenanceType: "pending",
            }),
          )}
          style={styles.footerButton}
          loading={creating}
          disabled={form.formState.isSubmitting}
        />
      </View>
    </View>
  );
};
