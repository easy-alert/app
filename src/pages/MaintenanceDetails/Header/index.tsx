import { View, Text } from "react-native";

import { styles } from "./styles";

import type { IMaintenance } from "@/types/IMaintenance";

import { getStatus } from "@/utils/getStatus";

interface HeaderProps {
  maintenanceDetailsData: IMaintenance;
}

export const Header = ({ maintenanceDetailsData }: HeaderProps) => {
  return (
    <View>
      <Text style={styles.buildingName}>{maintenanceDetailsData?.Building.name}</Text>

      <View style={styles.tags}>
        <View
          style={[
            styles.tag,
            {
              backgroundColor: getStatus(maintenanceDetailsData?.MaintenancesStatus.name!).color,
            },
          ]}
        >
          <Text style={styles.tagText}>{getStatus(maintenanceDetailsData?.MaintenancesStatus.name!).label}</Text>
        </View>

        {maintenanceDetailsData?.Maintenance.MaintenanceType && (
          <View
            style={[
              styles.tag,
              {
                backgroundColor: getStatus(maintenanceDetailsData?.Maintenance.MaintenanceType.name).color,
              },
            ]}
          >
            <Text style={styles.tagText}>
              {getStatus(maintenanceDetailsData?.Maintenance.MaintenanceType.name).label}
            </Text>
          </View>
        )}

        {maintenanceDetailsData?.inProgress && (
          <View style={[styles.tag, { backgroundColor: getStatus("Em execução").color }]}>
            <Text style={styles.tagText}>{getStatus("Em execução").label}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
