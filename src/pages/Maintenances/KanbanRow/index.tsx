import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

import { PendingSyncBadge } from "@/components/PendingSyncBadge";
import type { ProtectedNavigation } from "@/routes/navigation";
import type { IKanbanColumn } from "@/types/api/IKanbanColumn";
import { formatDate } from "@/utils/formatDate";
import { getMaintenanceFlags } from "@/utils/getMaintenanceFlags";
import { getStatus } from "@/utils/getStatus";

import { createStyle } from "./styles";

interface KanbanRowProps {
  maintenance: IKanbanColumn["maintenances"][0];
  columnStatus: string;
  hasPendingSync: boolean;
  showOldExpired?: boolean;
  showFuture?: boolean;
}

export const KanbanRow = ({
  maintenance,
  columnStatus,
  hasPendingSync,
  showOldExpired,
  showFuture,
}: KanbanRowProps) => {
  const navigation = useNavigation<ProtectedNavigation>();

  const { isPending, isFuture, isExpired, isOldExpired, showExpiredOccasional, inProgress } = getMaintenanceFlags({
    maintenanceType: maintenance.type,
    maintenanceStatus: maintenance.status,
    maintenanceInProgress: maintenance.inProgress,
    maintenanceDate: maintenance.date,
    canReportExpired: maintenance.cantReportExpired,
  });

  const showFuturePending = showFuture && isPending && isFuture;
  const showCurrentPending = isPending && !isFuture;
  const showNonPending = !isPending;

  const showOldExpiredRow = showOldExpired && isOldExpired;
  const showCurrentExpired = isExpired && !isOldExpired;
  const showNonExpired = !isExpired;

  const shouldRender =
    ((showFuturePending || showCurrentPending || showNonPending) &&
      (showOldExpiredRow || showCurrentExpired || showNonExpired)) ||
    showExpiredOccasional ||
    inProgress;

  if (!shouldRender) return null;

  const handleNavigateToMaintenanceDetails = () => {
    navigation.navigate("MaintenanceDetails", {
      maintenanceId: maintenance.id,
    });
  };

  const styles = createStyle({
    columnStatus,
    maintenanceType: maintenance.type,
    maintenanceStatus: maintenance.status,
  });

  return (
    <TouchableOpacity style={styles.card} onPress={handleNavigateToMaintenanceDetails}>
      <View style={styles.cardHeader}>
        <Text style={styles.buildingName}>{maintenance.buildingName}</Text>
        <Text style={styles.serviceOrder}>#{maintenance.serviceOrderNumber}</Text>
      </View>

      <View style={styles.cardHeader}>
        <View style={styles.tagsContainer}>
          <View style={styles.typeTagContainer}>
            <Text style={styles.tagText}>{getStatus(maintenance.type).label}</Text>
          </View>

          {isPending && isFuture && (
            <View style={styles.futureTagContainer}>
              <Text style={styles.tagText}>{getStatus("Futura").label}</Text>
            </View>
          )}
        </View>

        <Text style={styles.priorityName}>{maintenance.priorityLabel}</Text>
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

      {(isPending || !isOldExpired) && maintenance.label && <Text style={styles.footerLabel}>{maintenance.label}</Text>}

      {hasPendingSync && <PendingSyncBadge />}
    </TouchableOpacity>
  );
};
