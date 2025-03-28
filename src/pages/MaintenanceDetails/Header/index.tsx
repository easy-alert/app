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
    </View>
  );
};
