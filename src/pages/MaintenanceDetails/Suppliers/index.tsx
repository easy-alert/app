import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { toast } from "sonner-native";

import { useRequiredAuth } from "@/contexts/AuthContext";

import { unlinkMaintenanceSupplier } from "@/services/mutations/unlinkMaintenanceSupplier";

import { alerts } from "@/utils/alerts";
import { formatPhoneBR } from "@/utils/formatPhoneBR";

import type { ISupplier } from "@/types/api/ISupplier";

import { SupplierModal } from "../SupplierModal";
import { styles } from "./styles";

interface SuppliersProps {
  supplier?: ISupplier;
  maintenanceId: string;
  enableSupplierButton?: boolean;
  getMaintenanceSupplier: () => Promise<void>;
}

export const Suppliers = ({
  supplier,
  maintenanceId,
  enableSupplierButton = true,
  getMaintenanceSupplier,
}: SuppliersProps) => {
  const {
    user: { id: userId },
  } = useRequiredAuth();

  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const toggleSupplierModal = async () => {
    getMaintenanceSupplier();
    setShowSupplierModal((prev) => !prev);
  };

  const handleUnlinkMaintenanceSupplier = async () => {
    if (!supplier) {
      return;
    }

    const { success, message } = await unlinkMaintenanceSupplier({
      maintenanceHistoryId: maintenanceId,
      supplierId: supplier.id,
      userId,
    });

    if (success) {
      toast.success(message);
      await getMaintenanceSupplier();
    } else {
      alerts.error(message);
    }
  };

  return (
    <>
      <SupplierModal maintenanceId={maintenanceId} visible={showSupplierModal} onClose={toggleSupplierModal} />

      <View>
        <View
          style={[
            styles.titleContainer,
            { justifyContent: supplier ? "space-between" : "flex-end", marginBottom: supplier ? 12 : 0 },
          ]}
        >
          {supplier && <Text style={styles.titleLabel}>Prestador de serviço</Text>}

          {enableSupplierButton &&
            (supplier ? (
              <TouchableOpacity onPress={handleUnlinkMaintenanceSupplier} style={styles.unlinkButton}>
                <Text style={styles.buttonLabel}>Desvincular</Text>
                <Icon name="link" size={16} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={toggleSupplierModal}>
                <Text style={styles.buttonLabel}>Adicionar prestador de serviço </Text>
                <Icon name="plus" size={16} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>
            ))}
        </View>

        {supplier && enableSupplierButton && (
          <View style={styles.supplierContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: supplier.image,
                }}
                style={styles.avatarImage}
              />
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.nameLabel}>{supplier.name}</Text>
              <Text style={styles.emailLabel}>
                <Icon name="mail" size={12} /> {supplier.email || "-"}
              </Text>
              <Text style={styles.websiteLabel}>
                <Icon name="phone" size={12} /> {formatPhoneBR(supplier.phone || "-")}
              </Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
};
