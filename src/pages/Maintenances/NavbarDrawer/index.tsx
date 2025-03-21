import { Modal, TouchableOpacity, Linking, Text, FlatList } from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/contexts/AuthContext";
import { ScreenWithCloseButton } from "@/components/ScreenWithCloseButton";

import { styles } from "./styles";

interface NavbarDrawerProps {
  open: boolean;
  toggleOpen: () => void;
  buildingNanoId: string;
}

export const NavbarDrawer = ({ open, toggleOpen, buildingNanoId }: NavbarDrawerProps) => {
  const openWeb = () => {
    Linking.openURL(`https://public.easyalert.com.br/syndicarea/${buildingNanoId}?syndicNanoId=${userId}`);
  };

  const handleLogout = async () => {
    await logout();
    toggleOpen();
  };

  const options = [
    {
      label: "Acesso web",
      action: openWeb,
    },
    {
      label: "Sair",
      action: handleLogout,
    },
  ];

  const { logout, userId } = useAuth();

  return (
    <Modal visible={open} animationType="slide" onRequestClose={toggleOpen}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <ScreenWithCloseButton title="Opções" onClose={toggleOpen}>
            <FlatList
              data={options}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={item.action}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </ScreenWithCloseButton>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};
