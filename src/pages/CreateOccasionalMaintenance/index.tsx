import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform } from "react-native";

import { PageLayout } from "@/components/PageLayout";
import { PageWithHeader } from "@/components/PageWithHeader";
import type { ProtectedNavigation } from "@/routes/navigation";

import { Form } from "./Form";

export const CreateOccasionalMaintenance = () => {
  const navigation = useNavigation<ProtectedNavigation>();

  return (
    <PageLayout>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <PageWithHeader title="Manutenção avulsa" onClose={() => navigation.goBack()} isScrollView>
          <Form />
        </PageWithHeader>
      </KeyboardAvoidingView>
    </PageLayout>
  );
};
