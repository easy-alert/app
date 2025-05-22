import { FlatList, Modal, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { PageWithHeader } from "@/components/PageWithHeader";
import { useAuth } from "@/contexts/AuthContext";

import { styles } from "./styles";

interface NavbarDrawerProps {
  open: boolean;
  toggleOpen: () => void;
}

export const NavbarDrawer = ({ open, toggleOpen }: NavbarDrawerProps) => {
  const handleLogout = async () => {
    await logout();
    toggleOpen();
  };

  const buttons = [
    {
      label: "Sair",
      action: handleLogout,
    },
  ];

  const { logout } = useAuth();

  return (
    <Modal visible={open} animationType="slide" onRequestClose={toggleOpen} statusBarTranslucent>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <PageWithHeader title="Opções" onClose={toggleOpen}>
            <FlatList
              data={buttons}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={item.action}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </PageWithHeader>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};
