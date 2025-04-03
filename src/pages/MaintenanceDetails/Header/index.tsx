import { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { getStatus } from "@/utils/getStatus";
import { getOfflineQueue } from "@/utils/offlineQueue";
import { PendingSyncBadge } from "@/components/PendingSyncBadge";

import { styles } from "./styles";

import type { IMaintenance } from "@/types/IMaintenance";

interface HeaderProps {
  maintenanceDetails: IMaintenance;
}

export const Header = ({ maintenanceDetails }: HeaderProps) => {
  const [pendingSync, setPendingSync] = useState(false);

  useEffect(() => {
    const handleGetPendingSync = async () => {
      const offlineQueue = await getOfflineQueue();
      const pendingSync = offlineQueue.some((item) => item.maintenanceId === maintenanceDetails.id);
      setPendingSync(pendingSync);
    };

    handleGetPendingSync();
  }, [maintenanceDetails.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleLabel}>{maintenanceDetails.Building.name}</Text>

      <View style={styles.tagsContainer}>
        <View
          style={[
            styles.tagContainer,
            {
              backgroundColor: getStatus(maintenanceDetails.MaintenancesStatus.name).color,
            },
          ]}
        >
          <Text style={styles.tagLabel}>{getStatus(maintenanceDetails.MaintenancesStatus.name).label}</Text>
        </View>

        {maintenanceDetails.Maintenance.MaintenanceType && (
          <View
            style={[
              styles.tagContainer,
              {
                backgroundColor: getStatus(maintenanceDetails.Maintenance.MaintenanceType.name).color,
              },
            ]}
          >
            <Text style={styles.tagLabel}>{getStatus(maintenanceDetails.Maintenance.MaintenanceType.name).label}</Text>
          </View>
        )}

        {maintenanceDetails.inProgress && (
          <View
            style={[
              styles.tagContainer,
              {
                backgroundColor: getStatus("Em execução").color,
              },
            ]}
          >
            <Text style={styles.tagLabel}>{getStatus("Em execução").label}</Text>
          </View>
        )}
      </View>

      {pendingSync && <PendingSyncBadge />}
    </View>
  );
};
