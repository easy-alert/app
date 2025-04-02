import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import { Routes } from "@/routes";
import { useAuth } from "@/contexts/AuthContext";
import { Splash } from "@/components/Splash";
import { Login } from "@/pages/Login";
import { OfflineData } from "@/components/OfflineData";

export const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <Splash />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <OfflineData />
      <Routes />
    </SafeAreaView>
  );
};
