import { View, Text } from "react-native";

import { formatDate } from "@/utils/formatDate";

import { styles } from "./styles";

import type { IMaintenance } from "@/types/IMaintenance";

interface DataLabelsProps {
  maintenanceDetails: IMaintenance;
}

export const DataLabels = ({ maintenanceDetails }: DataLabelsProps) => {
  return (
    <View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Categoria</Text>
        <Text style={styles.infoValue}>{maintenanceDetails.Maintenance.Category.name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Elemento</Text>
        <Text style={styles.infoValue}>{maintenanceDetails.Maintenance.element}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Atividade</Text>
        <Text style={styles.infoValue}>{maintenanceDetails.Maintenance.activity}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Responsável</Text>
        <Text style={styles.infoValue}>{maintenanceDetails.Maintenance.responsible}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Fonte</Text>
        <Text style={styles.infoValue}>{maintenanceDetails.Maintenance.source}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Observação da manutenção</Text>
        <Text style={styles.infoValue}>{maintenanceDetails.Maintenance.observation}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Instruções</Text>
        <Text style={styles.infoValue}>{maintenanceDetails.Maintenance.instructions[0]?.name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Periodicidade</Text>
        {maintenanceDetails.Maintenance.MaintenanceType.name === "common" ? (
          <Text style={styles.infoValue}>
            {maintenanceDetails.Maintenance.frequency ?? ""}{" "}
            {(maintenanceDetails.Maintenance.frequency ?? 0 > 1)
              ? maintenanceDetails.Maintenance.FrequencyTimeInterval.pluralLabel === "anos" &&
                maintenanceDetails.Maintenance.frequency === 1
                ? "ano"
                : maintenanceDetails.Maintenance.FrequencyTimeInterval.pluralLabel
              : maintenanceDetails.Maintenance.FrequencyTimeInterval.singularLabel}
          </Text>
        ) : (
          <Text style={styles.infoValue}>-</Text>
        )}
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Data de notificação</Text>
        <Text style={styles.infoValue}>{formatDate(maintenanceDetails.notificationDate || "")}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Data de vencimento</Text>
        <Text style={styles.infoValue}>{formatDate(maintenanceDetails.dueDate || "")}</Text>
      </View>

      {maintenanceDetails.resolutionDate && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data de conclusão</Text>
          <Text style={styles.infoValue}>{formatDate(maintenanceDetails.resolutionDate)}</Text>
        </View>
      )}
    </View>
  );
};
