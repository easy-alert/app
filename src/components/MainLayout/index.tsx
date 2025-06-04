import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OfflineBadge } from "../OfflineBadge";

interface MainLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const MainLayout = ({ children, style }: MainLayoutProps) => {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]} edges={["top"]}>
      <OfflineBadge />
      {children}
    </SafeAreaView>
  );
};
