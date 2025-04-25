import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { ScreenWithCloseButton } from "@/components/ScreenWithCloseButton";
import { useAuth } from "@/contexts/AuthContext";
import { getSuppliersForMaintenance } from "@/services/getSuppliersForMaintenance";
import { linkMaintenanceSupplier } from "@/services/linkMaintenanceSupplier";
import type { IMaintenanceSuppliers } from "@/types/IMaintenanceSuppliers";

import { styles } from "./styles";

interface SupplierModalProps {
  maintenanceId: string;
  visible: boolean;
  onClose: () => void;
}

export const SupplierModal = ({ maintenanceId, visible, onClose }: SupplierModalProps) => {
  const { userId } = useAuth();

  const [suppliersData, setSuppliersData] = useState<IMaintenanceSuppliers>();

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
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <ScreenWithCloseButton title="Vincular fornecedor" onClose={onClose} isScrollView>
            <Text style={styles.subtitleLabel}>
              Clique em uma das opções abaixo para vincular o fornecedor desejado:
            </Text>

            <Text style={styles.titleLabel}>Sugeridos</Text>

            {suppliersData?.suggestedSuppliers.map((supplier) => (
              <TouchableOpacity
                key={supplier.id}
                style={styles.optionContainer}
                onPress={() => handleLinkMaintenanceSupplier(supplier.id)}
              >
                <Text style={styles.optionLabel}>{supplier.name}</Text>
              </TouchableOpacity>
            ))}

            {suppliersData?.suggestedSuppliers.length === 0 && (
              <Text style={styles.emptyLabel}>Nenhum fornecedor encontrado.</Text>
            )}

            <Text style={styles.titleLabel}>Outros</Text>

            {suppliersData?.remainingSuppliers.map((suppliers) => (
              <TouchableOpacity
                key={suppliers.id}
                style={styles.optionContainer}
                onPress={() => handleLinkMaintenanceSupplier(suppliers.id)}
              >
                <Text style={styles.optionLabel}>{suppliers.name}</Text>
              </TouchableOpacity>
            ))}

            {suppliersData?.remainingSuppliers.length === 0 && (
              <Text style={styles.emptyLabel}>Nenhum fornecedor encontrado.</Text>
            )}

            <Text style={styles.registerLabel}>
              Não encontrou o fornecedor que procura?{" "}
              <Text style={styles.registerLinkLabel} onPress={() => console.log("Cadastrar fornecedor")}>
                Clique aqui para cadastrar!
              </Text>
            </Text>
          </ScreenWithCloseButton>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};
