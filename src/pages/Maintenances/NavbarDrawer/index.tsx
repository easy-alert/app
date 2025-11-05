import { FlatList, Linking, Modal, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import { useAuth } from "@/contexts/AuthContext";

import { PageWithHeaderLayout } from "@/layouts/PageWithHeaderLayout";

import { styles } from "./styles";

interface NavbarDrawerProps {
  open: boolean;
  toggleOpen: () => void;
}

export const NavbarDrawer = ({ open, toggleOpen }: NavbarDrawerProps) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toggleOpen();
  };

  const handleOpenWeb = async () => {
    const url = "https://company.easyalert.com.br/login";
    try {
      await Linking.openURL(url);
    } catch (e) {
      toast.error("Não foi possível abrir o link. Verifique sua conexão com a internet.");
      console.error("Failed to open URL:", e);

      // Optionally, show an error message to the user
    }
    toggleOpen();
  };

  const buttons = [
    { label: "Acesso web", action: handleOpenWeb },
    {
      label: "Sair",
      action: handleSignOut,
    },
  ];

  return (
    <Modal visible={open} animationType="slide" onRequestClose={toggleOpen} statusBarTranslucent>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <PageWithHeaderLayout title="Opções" onClose={toggleOpen}>
            <FlatList
              data={buttons}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={item.action}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </PageWithHeaderLayout>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};
