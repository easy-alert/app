import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform } from "react-native";

import { PageLayout } from "@/components/PageLayout";
import { ScreenWithCloseButton } from "@/components/ScreenWithCloseButton";
import type { ProtectedNavigation } from "@/routes/navigation";

import { Form } from "./Form";

export const CreateOccasionalMaintenance = () => {
  const navigation = useNavigation<ProtectedNavigation>();

  return (
    <PageLayout>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScreenWithCloseButton title="Manutenção avulsa" onClose={() => navigation.goBack()} isScrollView>
          <Form />
        </ScreenWithCloseButton>
      </KeyboardAvoidingView>
    </PageLayout>
  );
};
