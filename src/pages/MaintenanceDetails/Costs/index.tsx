import React from "react";
import { View, Text, TextInput } from "react-native";

import { styles } from "./styles";

import type { IMaintenance } from "@/types/IMaintenance";

interface CostsProps {
  maintenanceDetailsData?: IMaintenance;
  cost: string;
  setCost: (cost: string) => void;
}

export const Costs = ({ maintenanceDetailsData, cost, setCost }: CostsProps) => {
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

  return (
    <View style={styles.container}>
      {/* Input de Custo */}
      {maintenanceDetailsData?.MaintenancesStatus.name !== "completed" ? (
        maintenanceDetailsData?.MaintenancesStatus.name !== "overdue" ? (
          <>
            <Text style={styles.sectionHeaderText}>Custo</Text>
            <TextInput
              style={styles.input}
              placeholder="R$ 0,00"
              value={cost}
              onChangeText={(text) => handleChangeCost(text)}
              keyboardType="numeric"
            />
          </>
        ) : (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Custo</Text>
            <Text style={styles.infoValue}>{`R$ ${cost}`}</Text>
          </View>
        )
      ) : (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Custo</Text>
          <Text style={styles.infoValue}>{`R$ ${cost}`}</Text>
        </View>
      )}
    </View>
  );
};
