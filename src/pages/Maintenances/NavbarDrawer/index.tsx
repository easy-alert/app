import { FlatList, Linking, Modal, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { ScreenWithCloseButton } from "@/components/ScreenWithCloseButton";
import { useAuth } from "@/contexts/AuthContext";

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

  const buttons = [
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
    <Modal visible={open} animationType="slide" onRequestClose={toggleOpen} statusBarTranslucent>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <ScreenWithCloseButton title="Opções" onClose={toggleOpen}>
            <FlatList
              data={buttons}
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
