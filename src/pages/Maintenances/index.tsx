import { useNavigationState } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import type { RouteList } from "@/routes/navigation";
import { getMaintenancesKanban } from "@/services/queries/getMaintenancesKanban";
import type { IKanbanColumn } from "@/types/api/IKanbanColumn";
import { AvailableFilter } from "@/types/utils/AvailableFilter";
import { KanbanFilter } from "@/types/utils/Filter";
import { emptyFilters } from "@/utils/filters";

import { CreateOccasionalMaintenanceButton } from "./CreateOccasionalMaintenanceButton";
import { Kanban } from "./Kanban";
import { Navbar } from "./Navbar";
import { styles } from "./styles";

export const Maintenances = () => {
  const navigationState = useNavigationState((state) => state);

  const { userId } = useAuth();

  const [kanbanData, setKanbanData] = useState<IKanbanColumn[]>([]);
  const [filters, setFilters] = useState<KanbanFilter>(emptyFilters);
  const [availableCategories, setAvailableCategories] = useState<AvailableFilter[]>([]);

  const [loading, setLoading] = useState(true);

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
          setFilters={setFilters}
          availableCategories={availableCategories}
        />
      )}
      {!loading && <CreateOccasionalMaintenanceButton />}
    </View>
  );
};
