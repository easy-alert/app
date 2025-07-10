import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { toast } from "sonner-native";
import { z } from "zod";

import { useAuth } from "@/contexts/AuthContext";

import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { DateTimeInput } from "@/components/DateTimeInput";
import { Dropdown } from "@/components/Dropdown";
import { LabelInput } from "@/components/LabelInput";
import { MultiSelect } from "@/components/MultiSelect";

import type { ProtectedNavigation } from "@/routes/navigation";

import { createOccasionalMaintenance } from "@/services/mutations/createOccasionalMaintenance";
import { getCategories } from "@/services/queries/getCategories";
import { getUsers } from "@/services/queries/getUsers";

import { alerts } from "@/utils/alerts";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { normalizeString } from "@/utils/normalizeString";
import { storageKeys } from "@/utils/storageKeys";

import type { IBuilding } from "@/types/api/IBuilding";
import type { ICategory } from "@/types/api/ICategory";
import type { IUser } from "@/types/api/IUser";
import { PRIORITY_NAME } from "@/types/api/TPriorityName";
import { RESPONSIBLE } from "@/types/api/TResponsible";

import { styles } from "./styles";

const formSchema = z.object({
  buildingId: z.string().min(1, { message: "Edificação é obrigatória." }),
  categoryId: z.string().min(1, { message: "Categoria é obrigatória." }),
  element: z.string().min(1, { message: "Elemento é obrigatório." }),
  activity: z.string().min(1, { message: "Atividade é obrigatória." }),
  responsible: z.string().min(1, { message: "Responsável é obrigatório." }),
  users: z.array(z.string()).min(1, { message: "Usuários é obrigatório." }),
  priority: z.string().min(1, { message: "Prioridade é obrigatória." }),
  executionDate: z.string().min(1, { message: "Data de execução é obrigatória." }),
});

export const Form = () => {
  const { userId } = useAuth();
  const navigation = useNavigation<ProtectedNavigation>();

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creatingInProgress, setCreatingInProgress] = useState(false);

  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buildingId: "",
      categoryId: "",
      element: "",
      activity: "",
      responsible: RESPONSIBLE[0].label,
      users: [],
      priority: PRIORITY_NAME.find((item) => item.name === "medium")?.name || "",
      executionDate: new Date().toISOString(),
    },
  });

  const buildingId = form.watch("buildingId");

  const handleCreateOccasionalMaintenance = async ({
    inProgress = false,
    data,
  }: {
    inProgress?: boolean;
    data: z.infer<typeof formSchema>;
  }) => {
    if (inProgress) {
      setCreatingInProgress(true);
    } else {
      setCreating(true);
    }

    const { buildingId, categoryId, element, activity, responsible, users, priority, executionDate } = data;

    const {
      success,
      message,
      data: responseData,
    } = await createOccasionalMaintenance({
      origin: "Mobile",
      userId,
      occasionalMaintenanceType: "pending",
      occasionalMaintenanceData: {
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
        },

        users,
      },
    });

    if (success) {
      toast.success(message);
      navigation.replace("MaintenanceDetails", {
        maintenanceId: responseData.maintenance.id,
      });
    } else {
      alerts.error(message);
    }

    setCreating(false);
    setCreatingInProgress(false);
  };

  useEffect(() => {
    const handleGetCategories = async () => {
      setLoadingCategories(true);
      const categories = await getCategories();

      setCategories(categories);
      setLoadingCategories(false);
    };

    const getBuildings = async () => {
      const storageBuildings = await AsyncStorage.getItem(storageKeys.BUILDING_LIST_KEY);

      if (storageBuildings) {
        setBuildings(JSON.parse(storageBuildings));
      }
    };

    handleGetCategories();
    getBuildings();
  }, [navigation]);

  useEffect(() => {
    const handleGetUsers = async () => {
      if (!buildingId) return;

      setLoadingUsers(true);

      const users = await getUsers({ buildingId });

      if (users) {
        setUsers(users.users);

        const userInBuilding = users.users.some((user) => user.id === userId);
        if (userInBuilding) {
          form.setValue("users", [userId]);
        } else {
          form.setValue("users", []);
        }
      }

      setLoadingUsers(false);
    };

    handleGetUsers();
  }, [buildingId, userId]);

  useEffect(() => {
    if (!buildingId) return;

    const selectedBuildingName = buildings.find((building) => building.id === buildingId)?.name;
    if (!selectedBuildingName) return;

    const buildingWords = normalizeString(selectedBuildingName).split(/\s+/).filter(Boolean);

    let bestCategory: ICategory | null = null;
    let bestScore = 0;

    categories.forEach((category) => {
      if (!category.name) return;

      const normalizedCategory = normalizeString(category.name);
      const categoryWords = normalizedCategory.split(/\s+/).filter(Boolean);
      const score = buildingWords.reduce((acc, word) => acc + (categoryWords.includes(word) ? 1 : 0), 0);

      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    });

    if (bestCategory && bestScore > 0) {
      form.setValue("categoryId", (bestCategory as ICategory).id);
    } else {
      form.setValue("categoryId", "");
    }
  }, [buildingId, categories, buildings]);

  return (
    <View style={styles.container}>
      <Controller
        control={form.control}
        name="buildingId"
        render={({ field }) => (
          <LabelInput label="Edificação *" error={form.formState.errors.buildingId?.message}>
            <Dropdown
              placeholder="Selecione a edificação"
              data={buildings}
              labelField="name"
              valueField="id"
              value={field.value}
              onChange={(item) => field.onChange(item.id)}
              disable={form.formState.isSubmitting}
              loading={loadingUsers}
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
                id: category.id,
                name: category.name,
              }))}
              labelField="name"
              valueField="id"
              value={field.value}
              onChange={(item) => field.onChange(item.id)}
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
              data={[...RESPONSIBLE]}
              labelField="label"
              valueField="label"
              value={field.value}
              onChange={(value) => field.onChange(value.label)}
              disable={form.formState.isSubmitting}
            />
          </LabelInput>
        )}
      />

      <Controller
        control={form.control}
        name="users"
        render={({ field }) => (
          <LabelInput label="Usuário(s) *" error={form.formState.errors.responsible?.message}>
            <MultiSelect
              placeholder="Selecione um ou mais usuários"
              data={users}
              labelField="name"
              valueField="id"
              value={field.value}
              onChange={(value) => field.onChange(value)}
              disable={form.formState.isSubmitting || !buildingId}
              loading={loadingUsers}
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
              data={[...PRIORITY_NAME].map((item) => ({
                ...item,
                label: capitalizeFirstLetter(item.label),
              }))}
              labelField="label"
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
