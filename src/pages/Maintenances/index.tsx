import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useNavigationState } from "@react-navigation/native";

import { useAuth } from "@/contexts/AuthContext";

import type { RouteList } from "@/routes/navigation";

import { getMaintenancesKanban } from "@/services/queries/getMaintenancesKanban";

import { emptyFilters } from "@/utils/filters";

import type { IKanbanColumn } from "@/types/api/IKanbanColumn";
import type { AvailableFilter } from "@/types/utils/AvailableFilter";
import type { KanbanFilter } from "@/types/utils/Filter";
import type { IMaintenancesLength } from "@/types/utils/IMaintenancesLength";

import { CreateOccasionalMaintenanceButton } from "./CreateOccasionalMaintenanceButton";
import { Kanban } from "./Kanban";
import { Navbar } from "./Navbar";
import { styles } from "./styles";

export const Maintenances = () => {
  const navigationState = useNavigationState((state) => state);

  const { userId } = useAuth();

  const [kanbanData, setKanbanData] = useState<IKanbanColumn[]>([]);
  const [maintenancesLength, setMaintenancesLength] = useState<IMaintenancesLength>({
    pending: 0,
    inProgress: 0,
    completed: 0,
    expired: 0,
    future: 0,
  });
  const [filters, setFilters] = useState<KanbanFilter>(emptyFilters);
  const [availableCategories, setAvailableCategories] = useState<AvailableFilter[]>([]);

  const [loading, setLoading] = useState(true);

  const handleMaintenancesLength = (kanbanToLength: IKanbanColumn[]) => {
    const pendingLength = kanbanToLength.find((k) => k.status === "Pendentes")?.maintenances.length || 0;
    const completedLength = kanbanToLength.find((k) => k.status === "Concluídas")?.maintenances.length || 0;
    const inProgressLength = kanbanToLength.find((k) => k.status === "Em execução")?.maintenances.length || 0;
    const expiredLength = kanbanToLength.find((k) => k.status === "Vencidas")?.maintenances.length || 0;
    const futureLength =
      kanbanToLength
        .find((k) => k.status === "Pendentes")
        ?.maintenances.filter((m) => new Date(m.date) > new Date(new Date().setHours(0, 0, 0, 0))).length || 0;

    setMaintenancesLength({
      pending: pendingLength - futureLength,
      completed: completedLength,
      inProgress: inProgressLength,
      expired: expiredLength,
      future: futureLength,
    });
  };

  const handleChangeMaintenancesLength = (key: string, value: number) => {
    setMaintenancesLength((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    const handleGetKanbanData = async () => {
      setLoading(true);

      const maintenancesKanban = await getMaintenancesKanban({
        userId,
        filters: {
          buildings: filters.selectedBuildings,
          status: filters.selectedStatus,
          categories: filters.selectedCategories,
          users: filters.selectedUsers,
          search: filters.search,
          priorityNames: filters.selectedPriorityNames,
          types: filters.selectedTypes,
          startDate: filters.startDate.split("T")[0],
          endDate: filters.endDate.split("T")[0],
        },
      });

      if (maintenancesKanban) {
        setKanbanData(maintenancesKanban.kanban);
        handleMaintenancesLength(maintenancesKanban.kanban);

        const availableCategories = maintenancesKanban.maintenanceCategoriesForSelect.map((category) => ({
          value: category.id,
          label: category.name,
        }));

        setAvailableCategories(availableCategories);
      }

      setLoading(false);
    };

    // Significa que uma navegação foi feita para a tela de manutenções.
    const toRefreshData = (navigationState.routes[navigationState.index].name as RouteList) === "Maintenances";

    if (toRefreshData) {
      handleGetKanbanData();
    }
  }, [navigationState.index, navigationState.routes, userId, filters]);

  return (
    <View style={styles.container}>
      <Navbar />

      {loading && <ActivityIndicator size="large" color="#ff3535" style={styles.loading} />}

      {!loading && kanbanData.length === 0 && <Text style={styles.emptyDataLabel}>Nenhum dado encontrado.</Text>}

      {!loading && kanbanData.length > 0 && (
        <Kanban
          kanbanData={kanbanData}
          filters={filters}
          availableCategories={availableCategories}
          maintenancesLength={maintenancesLength}
          setFilters={setFilters}
          handleChangeMaintenancesLength={handleChangeMaintenancesLength}
        />
      )}
      {!loading && <CreateOccasionalMaintenanceButton />}
    </View>
  );
};
