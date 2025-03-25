import { KeyboardAvoidingView, Platform } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ScreenWithCloseButton } from "@/components/ScreenWithCloseButton";

import { Form } from "./Form";

import type { CreateOccasionalMaintenanceParams, Navigation } from "@/routes/navigation";

export const CreateOccasionalMaintenance = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const { buildingId } = route.params as CreateOccasionalMaintenanceParams;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScreenWithCloseButton title="Manutenção avulsa" onClose={() => navigation.goBack()}>
          <Form buildingId={buildingId} />
        </ScreenWithCloseButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
