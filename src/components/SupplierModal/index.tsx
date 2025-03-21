import React, { useEffect, useState } from "react";

import { Modal, Text, TouchableOpacity } from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { getSuppliersForMaintenance } from "@/services/getSuppliersForMaintenance";
import { linkMaintenanceSupplier } from "@/services/linkMaintenanceSupplier";
import { useAuth } from "@/contexts/AuthContext";

import { styles } from "./styles";

import { ScreenWithCloseButton } from "../ScreenWithCloseButton";

import type { IMaintenanceSuppliers } from "@/types/IMaintenanceSuppliers";

interface SupplierModalProps {
  maintenanceId: string;
  visible: boolean;
  onClose: () => void;
}

export const SupplierModal = ({ maintenanceId, visible, onClose }: SupplierModalProps) => {
  const { userId } = useAuth();

  const [suppliersData, setSuppliersData] = useState<IMaintenanceSuppliers | undefined>(undefined);

  const handleLinkMaintenanceSupplier = async (supplierId: string) => {
    try {
      await linkMaintenanceSupplier({
        maintenanceId,
        supplierId,
        userId,
      });
    } catch (error) {
      console.error("Erro ao vincular o fornecedor:", error);
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    const handleGetSuppliersForMaintenance = async () => {
      try {
        const responseData = await getSuppliersForMaintenance({ maintenanceId });

        if (responseData) {
          setSuppliersData(responseData);
        }
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };

    handleGetSuppliersForMaintenance();
  }, [maintenanceId]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <ScreenWithCloseButton title="Vincular fornecedor" onClose={onClose} isScrollView>
            <Text style={styles.subtitle}>Clique em uma das opções abaixo para vincular o fornecedor desejado:</Text>

            <Text style={styles.sectionHeaderText}>Sugeridos</Text>

            {suppliersData?.suggestedSuppliers.map((suppliers) => (
              <TouchableOpacity
                key={suppliers.id}
                style={styles.supplierOption}
                onPress={() => handleLinkMaintenanceSupplier(suppliers.id)}
              >
                <Text style={styles.supplierOptionText}>{suppliers.name}</Text>
              </TouchableOpacity>
            ))}

            {suppliersData?.suggestedSuppliers.length === 0 && (
              <Text style={styles.noSuppliersText}>Nenhum fornecedor encontrado.</Text>
            )}

            <Text style={styles.sectionHeaderText}>Outros</Text>

            {suppliersData?.remainingSuppliers.map((suppliers) => (
              <TouchableOpacity
                key={suppliers.id}
                style={styles.supplierOption}
                onPress={() => handleLinkMaintenanceSupplier(suppliers.id)}
              >
                <Text style={styles.supplierOptionText}>{suppliers.name}</Text>
              </TouchableOpacity>
            ))}

            {suppliersData?.remainingSuppliers.length === 0 && (
              <Text style={styles.noSuppliersText}>Nenhum fornecedor encontrado.</Text>
            )}

            <Text style={styles.linkToRegister}>
              Não encontrou o fornecedor que procura?{" "}
              <Text style={styles.linkText} onPress={() => console.log("Cadastrar fornecedor")}>
                Clique aqui para cadastrar!
              </Text>
            </Text>
          </ScreenWithCloseButton>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};
