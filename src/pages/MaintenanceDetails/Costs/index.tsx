import React from "react";
import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";

import type { IMaintenance } from "@/types/IMaintenance";

interface CostsProps {
  maintenanceDetails: IMaintenance;
  cost: string;
  setCost: (cost: string) => void;
}

export const Costs = ({ maintenanceDetails, cost, setCost }: CostsProps) => {
  const formatCurrency = (text: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = text.replace(/[^0-9]/g, "");

    // Converte para um número
    const value = parseFloat(numericValue) / 100;

    // Formata no padrão brasileiro
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
            style={styles.input}
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
          <Text style={styles.readonlyValueLabel}>{`R$ ${cost}`}</Text>
        </View>
      )}
    </View>
  );
};
