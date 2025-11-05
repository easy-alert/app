import { Text, View } from "react-native";

import { useOfflineQueue } from "@/contexts/OfflineQueueContext";

import { PendingSyncBadge } from "@/components/PendingSyncBadge";

import { getStatus } from "@/utils/getStatus";

import type { IMaintenance } from "@/types/api/IMaintenance";

import { styles } from "./styles";

interface HeaderProps {
  maintenanceDetails: IMaintenance;
}

export const Header = ({ maintenanceDetails }: HeaderProps) => {
  const { offlineQueue } = useOfflineQueue();
  const pendingSync = offlineQueue.some((item) => item.maintenanceId === maintenanceDetails.id);

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
