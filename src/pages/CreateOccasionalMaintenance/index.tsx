import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform } from "react-native";

import { PageWithHeaderLayout } from "@/layouts/PageWithHeaderLayout";
import type { ProtectedNavigation } from "@/routes/navigation";

import { Form } from "./Form";

export const CreateOccasionalMaintenance = () => {
  const navigation = useNavigation<ProtectedNavigation>();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <PageWithHeaderLayout title="Manutenção avulsa" onClose={() => navigation.goBack()} isScrollView>
        <Form />
      </PageWithHeaderLayout>
    </KeyboardAvoidingView>
  );
};
