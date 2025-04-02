import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigationState } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import { getBuildingLogo } from "@/services/getBuildingLogo";
import { getMaintenancesKanban } from "@/services/getMaintenancesKanban";
import { useAuth } from "@/contexts/AuthContext";

import { Kanban } from "./Kanban";
import { Navbar } from "./Navbar";
import { OfflineData } from "./OfflineData";

import { styles } from "./styles";

import type { IKanbanColumn } from "@/types/IKanbanColumn";
import type { RouteList } from "@/routes/navigation";

export const Maintenances = () => {
  const navigationState = useNavigationState((state) => state);

  const { userId, logout } = useAuth();

  const [kanbanData, setKanbanData] = useState<IKanbanColumn[]>([]);

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
          filter: {
            buildings: [buildingId],
            status: [],
            categories: [],
            users: [],
            priorityName: "",
            endDate: "2100-01-01",
            startDate: "1900-01-01",
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

    const toRefreshData = (navigationState.routes[navigationState.index].name as RouteList) === "Maintenances";

    if (toRefreshData) {
      handleGetKanbanData();
      handleGetBuildingLogo();
    }
  }, [logout, navigationState.index, navigationState.routes, userId]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <SafeAreaView style={styles.navbarContainer} edges={["top"]}>
        <Navbar logoUrl={logo} buildingNanoId={buildingId} />
      </SafeAreaView>

      <OfflineData />

      {loading && <ActivityIndicator size="large" color="#ff3535" style={styles.loading} />}

      {!loading && kanbanData.length === 0 && <Text style={styles.emptyDataLabel}>Nenhum dado encontrado.</Text>}

      {!loading && kanbanData.length > 0 && (
        <Kanban kanbanData={kanbanData} buildingName={buildingName} buildingId={buildingId} />
      )}
    </SafeAreaView>
  );
};
