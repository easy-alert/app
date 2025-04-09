import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform } from "react-native";

import { PageLayout } from "@/components/PageLayout";
import { ScreenWithCloseButton } from "@/components/ScreenWithCloseButton";
import type { CreateOccasionalMaintenanceParams, Navigation } from "@/routes/navigation";

import { Form } from "./Form";

export const CreateOccasionalMaintenance = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const { buildingId } = route.params as CreateOccasionalMaintenanceParams;

  return (
    <PageLayout>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScreenWithCloseButton title="Manutenção avulsa" onClose={() => navigation.goBack()}>
          <Form buildingId={buildingId} />
        </ScreenWithCloseButton>
      </KeyboardAvoidingView>
    </PageLayout>
  );
};
