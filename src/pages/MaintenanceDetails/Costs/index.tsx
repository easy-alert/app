import React from "react";
import { Text, TextInput, View } from "react-native";

import { commonStyles } from "@/components/common-styles";

import type { IMaintenance } from "@/types/api/IMaintenance";

import { styles } from "./styles";

interface CostsProps {
  maintenanceDetails: IMaintenance;
  cost: string;
  enableCost?: boolean;
  setCost: (cost: string) => void;
}

export const Costs = ({ maintenanceDetails, cost, enableCost, setCost }: CostsProps) => {
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

  return (
    <View style={styles.container}>
      {enableCost && (
        <>
          <Text style={styles.titleLabel}>Custo</Text>
          <TextInput
            style={[commonStyles.input, styles.input]}
            placeholder="R$ 0,00"
            value={formatCurrency(cost)}
            onChangeText={(text) => handleChangeCost(text)}
            keyboardType="numeric"
          />
        </>
      )}

      {!enableCost && (
        <View style={styles.readonlyContainer}>
          <Text style={styles.readonlyTitleLabel}>Custo</Text>
          <Text style={styles.readonlyValueLabel}>
            {formatCurrency(maintenanceDetails.MaintenanceReport?.[0].cost.toString() || "0")}
          </Text>
        </View>
      )}
    </View>
  );
};
