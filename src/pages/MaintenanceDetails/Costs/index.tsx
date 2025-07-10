import React from "react";
import { Text, TextInput, View } from "react-native";

import { commonStyles } from "@/components/common-styles";

import type { IMaintenance } from "@/types/api/IMaintenance";

import { styles } from "./styles";

interface CostsProps {
  maintenanceDetails: IMaintenance;
  cost: string;
  setCost: (cost: string) => void;
}

export const Costs = ({ maintenanceDetails, cost, setCost }: CostsProps) => {
  const formatCurrency = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const value = parseFloat(numericValue) / 100;

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleChangeCost = (text: string) => {
    const formatted = formatCurrency(text);
    setCost(formatted);
  };

  const canBeEdited =
    maintenanceDetails.MaintenancesStatus.name !== "completed" &&
    maintenanceDetails.MaintenancesStatus.name !== "overdue";

  return (
    <View style={styles.container}>
      {canBeEdited && (
        <>
          <Text style={styles.titleLabel}>Custo</Text>
          <TextInput
            style={[commonStyles.input, styles.input]}
            placeholder="R$ 0,00"
            value={cost}
            onChangeText={(text) => handleChangeCost(text)}
            keyboardType="numeric"
          />
        </>
      )}

      {!canBeEdited && (
        <View style={styles.readonlyContainer}>
          <Text style={styles.readonlyTitleLabel}>Custo</Text>
          <Text style={styles.readonlyValueLabel}>
            {formatCurrency(maintenanceDetails.MaintenanceReport[0].cost.toString())}
          </Text>
        </View>
      )}
    </View>
  );
};
