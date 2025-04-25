import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

import { PendingSyncBadge } from "@/components/PendingSyncBadge";
import type { Navigation } from "@/routes/navigation";
import type { IKanbanColumn } from "@/types/IKanbanColumn";
import { formatDate } from "@/utils/formatDate";
import { getStatus } from "@/utils/getStatus";

import { createStyle } from "./styles";

interface KanbanRowProps {
  maintenance: IKanbanColumn["maintenances"][0];
  columnStatus: string;
  hasPendingSync: boolean;
}

export const KanbanRow = ({ maintenance, columnStatus, hasPendingSync }: KanbanRowProps) => {
  const navigation = useNavigation<Navigation>();

  const handleNavigateToMaintenanceDetails = () => {
    navigation.navigate("MaintenanceDetails", {
      maintenanceId: maintenance.id,
    });
  };

  if (maintenance.cantReportExpired) {
    return null;
  }

  const styles = createStyle({
    columnStatus,
    maintenanceType: maintenance.type,
    maintenanceStatus: maintenance.status,
  });

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigateToMaintenanceDetails}>
      <View style={styles.typeTagContainer}>
        <Text style={styles.tagText}>{getStatus(maintenance.type).label}</Text>
      </View>

      {maintenance.status === "overdue" && (
        <View style={styles.statusTagContainer}>
          <Text style={styles.tagText}>{getStatus(maintenance.status).label}</Text>
        </View>
      )}

      <Text style={styles.cardTitle}>{maintenance.element}</Text>

      <Text style={styles.cardDescription}>{maintenance.activity}</Text>

      {(maintenance.status === "completed" || maintenance.status === "overdue") && (
        <Text style={styles.completedLabel}>Concluída em {formatDate(maintenance.date)}</Text>
      )}

      {maintenance.label && <Text style={styles.footerLabel}>{maintenance.label}</Text>}

      {hasPendingSync && <PendingSyncBadge />}
    </TouchableOpacity>
  );
};
