import { View, Text } from "react-native";

import { formatDate } from "@/utils/formatDate";

import { styles } from "./styles";

import type { IMaintenance } from "@/types/IMaintenance";

interface DataLabelsProps {
  maintenanceDetailsData: IMaintenance;
}

export const DataLabels = ({ maintenanceDetailsData }: DataLabelsProps) => {
  return (
    <View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Categoria</Text>
        <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.Category.name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Elemento</Text>
        <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.element}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Atividade</Text>
        <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.activity}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Responsável</Text>
        <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.responsible}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Fonte</Text>
        <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.source}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Observação da manutenção</Text>
        <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance.observation}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Instruções</Text>
        <Text style={styles.infoValue}>{maintenanceDetailsData?.Maintenance?.instructions[0]?.name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Periodicidade</Text>
        {maintenanceDetailsData?.Maintenance.MaintenanceType.name === "common" ? (
          <Text style={styles.infoValue}>
            {maintenanceDetailsData?.Maintenance.frequency ?? ""}{" "}
            {(maintenanceDetailsData?.Maintenance.frequency ?? 0 > 1)
              ? maintenanceDetailsData?.Maintenance.FrequencyTimeInterval.pluralLabel === "anos" &&
                maintenanceDetailsData?.Maintenance.frequency === 1
                ? "ano"
                : maintenanceDetailsData?.Maintenance.FrequencyTimeInterval.pluralLabel
              : maintenanceDetailsData?.Maintenance.FrequencyTimeInterval.singularLabel}
          </Text>
        ) : (
          <Text style={styles.infoValue}>-</Text>
        )}
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Data de notificação</Text>
        <Text style={styles.infoValue}>{formatDate(maintenanceDetailsData?.notificationDate || "")}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Data de vencimento</Text>
        <Text style={styles.infoValue}>{formatDate(maintenanceDetailsData?.dueDate || "")}</Text>
      </View>

      {maintenanceDetailsData?.resolutionDate && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data de conclusão</Text>
          <Text style={styles.infoValue}>{formatDate(maintenanceDetailsData?.resolutionDate)}</Text>
        </View>
      )}
    </View>
  );
};
