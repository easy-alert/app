import { View, Text } from "react-native";

import { getStatus } from "@/utils/getStatus";

import { styles } from "./styles";

import type { IMaintenance } from "@/types/IMaintenance";

interface HeaderProps {
  maintenanceDetails: IMaintenance;
}

export const Header = ({ maintenanceDetails }: HeaderProps) => {
  return (
    <View>
      <Text style={styles.buildingName}>{maintenanceDetails.Building.name}</Text>

      <View style={styles.tags}>
        <View
          style={[
            styles.tag,
            {
              backgroundColor: getStatus(maintenanceDetails.MaintenancesStatus.name).color,
            },
          ]}
        >
          <Text style={styles.tagText}>{getStatus(maintenanceDetails.MaintenancesStatus.name).label}</Text>
        </View>

        {maintenanceDetails.Maintenance.MaintenanceType && (
          <View
            style={[
              styles.tag,
              {
                backgroundColor: getStatus(maintenanceDetails.Maintenance.MaintenanceType.name).color,
              },
            ]}
          >
            <Text style={styles.tagText}>{getStatus(maintenanceDetails.Maintenance.MaintenanceType.name).label}</Text>
          </View>
        )}

        {maintenanceDetails.inProgress && (
          <View style={[styles.tag, { backgroundColor: getStatus("Em execução").color }]}>
            <Text style={styles.tagText}>{getStatus("Em execução").label}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
