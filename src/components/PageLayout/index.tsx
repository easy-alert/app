import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { OfflineQueueBadge } from "@/components/OfflineQueueBadge";

interface PageLayoutProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const PageLayout = ({ children, style }: PageLayoutProps) => {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: "#fff" }, style]}>
      <OfflineQueueBadge />
      {children}
    </SafeAreaView>
  );
};
