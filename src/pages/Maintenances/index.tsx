import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigationState } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";

import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import type { RouteList } from "@/routes/navigation";
import { getBuildingLogo } from "@/services/getBuildingLogo";
import { getMaintenancesKanban } from "@/services/getMaintenancesKanban";
import type { IKanbanColumn } from "@/types/IKanbanColumn";

import { CreateOccasionalMaintenanceButton } from "./CreateOccasionalMaintenanceButton";
import { Kanban } from "./Kanban";
import { Navbar } from "./Navbar";
import { styles } from "./styles";
import { emptyFilters, IFilter } from "./utils";

export const Maintenances = () => {
  const navigationState = useNavigationState((state) => state);

  const { userId, logout } = useAuth();

  const [kanbanData, setKanbanData] = useState<IKanbanColumn[]>([]);
  const [filters, setFilters] = useState<IFilter>(emptyFilters);

  const [buildingName, setBuildingName] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [logo, setLogo] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGetKanbanData = async () => {
      setLoading(true);

      try {
        const buildingId = await AsyncStorage.getItem("buildingId");
        const buildingName = await AsyncStorage.getItem("buildingName");

        if (!buildingId || !buildingName) {
          Alert.alert("Credenciais inválidas");
          await logout();
          return;
        }

        setBuildingId(buildingId);
        setBuildingName(buildingName);

        const responseData = await getMaintenancesKanban({
          userId,
          filters: {
            buildings: [buildingId],
            status: filters.selectedStatus,
            categories: filters.selectedCategories,
            users: filters.selectedUsers,
            search: filters.search,
            endDate: filters.endDate,
            startDate: filters.startDate,
          },
        });

        if (responseData) {
          setLoading(false);
          setKanbanData(responseData.kanban || []);
        }
      } catch (error) {
        setLoading(false);
        console.error("🚀 ~ handleGetKanbanData ~ error:", error);
      }
    };

    const handleGetBuildingLogo = async () => {
      try {
        const buildingId = await AsyncStorage.getItem("buildingId");

        if (!buildingId) {
          return;
        }

        const responseData = await getBuildingLogo({ buildingId });

        if (responseData) {
          setLogo(responseData.buildingLogo);
        }
      } catch (error) {
        console.error("🚀 ~ handleGetBuildingLogo ~ error:", error);
      }
    };

    // Significa que uma navegação foi feita para a tela de manutenções.
    const toRefreshData = (navigationState.routes[navigationState.index].name as RouteList) === "Maintenances";

    if (toRefreshData) {
      handleGetKanbanData();
      handleGetBuildingLogo();
    }
  }, [logout, navigationState.index, navigationState.routes, userId, filters]);

  return (
    <PageLayout>
      <Navbar logoUrl={logo} buildingNanoId={buildingId} />

      {loading && <ActivityIndicator size="large" color="#ff3535" style={styles.loading} />}

      {!loading && kanbanData.length === 0 && <Text style={styles.emptyDataLabel}>Nenhum dado encontrado.</Text>}

      {!loading && kanbanData.length > 0 && (
        <Kanban kanbanData={kanbanData} buildingName={buildingName} filters={filters} setFilters={setFilters} />
      )}

      {!loading && <CreateOccasionalMaintenanceButton buildingId={buildingId} />}
    </PageLayout>
  );
};
