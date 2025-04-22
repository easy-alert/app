import { Linking, Text, TouchableOpacity, View } from "react-native";

import type { IMaintenance } from "@/types/IMaintenance";
import { formatDate } from "@/utils/formatDate";

import truncateText from "../utils/truncateText";
import { styles } from "./styles";

interface DataLabelsProps {
  maintenanceDetails: IMaintenance;
}

export const DataLabels = ({ maintenanceDetails }: DataLabelsProps) => {
  const periodicityLabel: string = (() => {
    if (maintenanceDetails.Maintenance.MaintenanceType.name === "common") {
      const baseLabel = (maintenanceDetails.Maintenance.frequency ?? "") + " ";

      if ((maintenanceDetails.Maintenance.frequency ?? 0) > 1) {
        if (
          maintenanceDetails.Maintenance.FrequencyTimeInterval.pluralLabel === "anos" &&
          maintenanceDetails.Maintenance.frequency === 1
        ) {
          return baseLabel + "ano";
        }

        return baseLabel + maintenanceDetails.Maintenance.FrequencyTimeInterval.pluralLabel;
      }

      return baseLabel + maintenanceDetails.Maintenance.FrequencyTimeInterval.singularLabel;
    }

    return "-";
  })();

  return (
    <View>
      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Categoria</Text>
        <Text style={styles.valueLabel}>{maintenanceDetails.Maintenance.Category.name}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Elemento</Text>
        <Text style={styles.valueLabel}>{maintenanceDetails.Maintenance.element}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Atividade</Text>
        <Text style={styles.valueLabel}>{maintenanceDetails.Maintenance.activity}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Responsável</Text>
        <Text style={styles.valueLabel}>{maintenanceDetails.Maintenance.responsible}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Fonte</Text>
        <Text style={styles.valueLabel}>{maintenanceDetails.Maintenance.source}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Observação da manutenção</Text>
        <Text style={styles.valueLabel}>{maintenanceDetails.Maintenance.observation}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Instruções</Text>
        <View style={{ flex: 2 }}>
          {maintenanceDetails.Maintenance.instructions.map((instruction, index) =>
            instruction.url ? (
              <TouchableOpacity key={index} onPress={() => Linking.openURL(instruction.url)}>
                <Text
                  style={[styles.valueLabel, { color: "blue", textDecorationLine: "underline", textAlign: "left" }]}
                >
                  {truncateText(instruction.name)}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text key={index} style={[styles.valueLabel, { textAlign: "left" }]}>
                {truncateText(instruction.name)}
              </Text>
            ),
          )}
        </View>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Periodicidade</Text>
        <Text style={styles.valueLabel}>{periodicityLabel}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Data de notificação</Text>
        <Text style={styles.valueLabel}>{formatDate(maintenanceDetails.notificationDate)}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.titleLabel}>Data de vencimento</Text>
        <Text style={styles.valueLabel}>{formatDate(maintenanceDetails.dueDate)}</Text>
      </View>

      {maintenanceDetails.resolutionDate && (
        <View style={styles.rowContainer}>
          <Text style={styles.titleLabel}>Data de conclusão</Text>
          <Text style={styles.valueLabel}>{formatDate(maintenanceDetails.resolutionDate)}</Text>
        </View>
      )}
    </View>
  );
};
