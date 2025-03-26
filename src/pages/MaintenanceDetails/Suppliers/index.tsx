import { View, Text, TouchableOpacity, Image } from "react-native";

import React, { useState } from "react";

import Icon from "react-native-vector-icons/Feather";

import { unlinkMaintenanceSupplier } from "@/services/unlinkMaintenanceSupplier";
import { useAuth } from "@/contexts/AuthContext";

import { styles } from "./styles";

import { SupplierModal } from "../SupplierModal";

import type { ISupplier } from "@/types/ISupplier";

interface SuppliersProps {
  supplier?: ISupplier;
  maintenanceId: string;
  getMaintenanceSupplier: () => Promise<void>;
}

export const Suppliers = ({ supplier, maintenanceId, getMaintenanceSupplier }: SuppliersProps) => {
  const { userId } = useAuth();

  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const toggleSupplierModal = async () => {
    getMaintenanceSupplier();
    setShowSupplierModal((prev) => !prev);
  };

  const handleUnlinkMaintenanceSupplier = async () => {
    if (!supplier) {
      return;
    }

    await unlinkMaintenanceSupplier({
      maintenanceHistoryId: maintenanceId,
      supplierId: supplier.id,
      userId,
    });

    await getMaintenanceSupplier();
  };

  return (
    <>
      <SupplierModal maintenanceId={maintenanceId} visible={showSupplierModal} onClose={toggleSupplierModal} />

      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Fornecedor</Text>

          {supplier ? (
            <TouchableOpacity
              onPress={handleUnlinkMaintenanceSupplier}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={styles.unlinkText}>Desvincular</Text>
              <Icon name="link" size={16} color="#fff" style={styles.unlinkIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.unlinkButton} onPress={toggleSupplierModal}>
              <Text style={styles.unlinkText}>Vincular</Text>
              <Icon name="link" size={16} color="#fff" style={styles.unlinkIcon} />
            </TouchableOpacity>
          )}
        </View>

        {supplier ? (
          <View style={styles.supplierContainer}>
            <View style={styles.supplierAvatar}>
              <Image
                source={{
                  uri: supplier.image,
                }}
                style={styles.supplierAvatarImage}
              />
            </View>
            <View style={styles.supplierDetails}>
              <Text style={styles.supplierName}>{supplier.name}</Text>
              <Text style={styles.supplierEmail}>
                <Icon name="mail" size={12} /> {supplier.email || "-"}
              </Text>
              <Text style={styles.supplierWebsite}>
                <Icon name="phone" size={12} /> {supplier.phone || "-"}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.supplierContainer}>
            <View style={styles.supplierDetails}>
              <Text style={styles.supplierEmail}>Nenhum fornecedor encontrado.</Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
