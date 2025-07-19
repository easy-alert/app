import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "@/contexts/AuthContext";

import { PublicRoutesParams } from "@/routes/navigation";

import { styles } from "./styles";

type LoginCompanySelectionProps = {
  route?: {
    params?: PublicRoutesParams["LoginCompanySelection"];
  };
};

export const LoginCompanySelection = ({ route }: LoginCompanySelectionProps) => {
  const { signIn } = useAuth();
  const { companies, login, password } = route?.params ?? {};

  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSelectCompany = async (companyId: string) => {
    try {
      setIsLoading(true);
      setSelectedCompanyId(companyId);
      await signIn(login!, password!, companyId);
    } catch (error) {
      console.error("Error selecting company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Você tem acesso a mais de uma empresa. Por favor, selecione uma para continuar.
        </Text>

        <ScrollView style={styles.companiesContainer}>
          {companies?.map((company) => (
            <TouchableOpacity
              key={company.id}
              style={[
                styles.companyCard,
                company.isBlocked && styles.blockedCompanyCard,
                selectedCompanyId === company.id && styles.selectedCompanyCard,
              ]}
              onPress={() => !isLoading && handleSelectCompany(company.id)}
              disabled={isLoading || company.isBlocked}
            >
              {company.image ? (
                <Image source={{ uri: company.image }} style={styles.companyImage} />
              ) : (
                <View style={styles.companyImagePlaceholder}>
                  <Text style={styles.companyInitial}>{company.name.charAt(0).toUpperCase()}</Text>
                </View>
              )}

              <Text style={styles.companyName} numberOfLines={2}>
                {company.name}
              </Text>

              {isLoading && selectedCompanyId === company.id && (
                <ActivityIndicator size="small" color="#ff3535" style={styles.loadingIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};
