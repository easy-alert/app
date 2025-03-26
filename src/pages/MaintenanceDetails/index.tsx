import { KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

import { useNavigation, useRoute } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import { getMaintenanceDetails } from "@/services/getMaintenanceDetails";
import { getMaintenanceHistoryActivities } from "@/services/getMaintenanceHistoryActivities";
import { getMaintenanceHistorySupplier } from "@/services/getMaintenanceHistorySupplier";
import { getMaintenanceReportProgress } from "@/services/getMaintenanceReportProgress";
import { ScreenWithCloseButton } from "@/components/ScreenWithCloseButton";

import { Header } from "./Header";
import { DataLabels } from "./DataLabels";
import { Comments } from "./Comments";
import { Suppliers } from "./Suppliers";
import { History } from "./History";
import { Attachments } from "./Attachments";
import { Costs } from "./Costs";
import { CallToActions } from "./CallToActions";

import type { IMaintenanceHistoryActivities } from "@/types/IMaintenanceHistoryActivities";
import type { IMaintenance } from "@/types/IMaintenance";
import type { ISupplier } from "@/types/ISupplier";
import type { MaintenanceDetailsParams, Navigation } from "@/routes/navigation";

const OFFLINE_QUEUE_KEY = "offline_queue";

export const MaintenanceDetails = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute();
  const { maintenanceId } = route.params as MaintenanceDetailsParams;

  const [maintenanceDetailsData, setMaintenanceDetailsData] = useState<IMaintenance>();
  const [supplierData, setSupplierData] = useState<ISupplier | null>();
  const [historyActivitiesData, setHistoryActivitiesData] = useState<IMaintenanceHistoryActivities>();
  const [cost, setCost] = useState("0,00"); // Estado para o custo
  const [files, setFiles] = useState<{ originalName: string; url: string; name: string }[]>([]); // Estado para os arquivos ainda não upados
  const [images, setImages] = useState<{ originalName: string; url: string; name: string }[]>([]); // Estado para as imagens ainda não upadas
  const [loading, setLoading] = useState(false);

  const handleGetMaintenanceDetails = async () => {
    try {
      const responseData = await getMaintenanceDetails({
        maintenanceHistoryId: maintenanceId,
      });

      setMaintenanceDetailsData(responseData);
    } catch (error) {
      console.error("🚀 ~ handleGetMaintenanceDetails ~ error:", error);
    }
  };

  const handleGetMaintenanceReportProgress = async () => {
    try {
      const responseData = await getMaintenanceReportProgress({
        maintenanceHistoryId: maintenanceId,
      });

      setCost(String(responseData?.progress?.cost || 0 / 100).replace(".", ","));
      setFiles(responseData?.progress?.ReportAnnexesProgress || []);
      setImages(responseData?.progress?.ReportImagesProgress || []);
    } catch (error) {
      console.error("🚀 ~ handleGetMaintenanceReportProgress ~ error:", error);
    }
  };

  const handleGetMaintenanceHistoryActivities = async () => {
    try {
      const responseData = await getMaintenanceHistoryActivities({
        maintenanceHistoryId: maintenanceId,
      });

      setHistoryActivitiesData(responseData);
    } catch (error) {
      console.error("🚀 ~ handleGetMaintenanceReportProgress ~ error:", error);
    }
  };

  const handleGetMaintenanceSupplier = async () => {
    try {
      const responseData = await getMaintenanceHistorySupplier({
        maintenanceHistoryId: maintenanceId,
      });

      if (responseData?.suppliers?.length === 0) {
        setSupplierData(null);
        return;
      }

      setSupplierData(responseData?.suppliers[0]);
    } catch (error) {
      console.error("🚀 ~ handleGetMaintenanceSupplier ~ error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!maintenanceId) {
        return;
      }

      setLoading(true);

      try {
        await handleGetMaintenanceReportProgress();
        await handleGetMaintenanceDetails();
        await handleGetMaintenanceSupplier();
        await handleGetMaintenanceHistoryActivities();
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenanceId]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ff3535"
        style={{ alignContent: "center", justifyContent: "center", flex: 1 }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScreenWithCloseButton title="Enviar relato" onClose={() => navigation.goBack()} isScrollView>
          <Header maintenanceDetailsData={maintenanceDetailsData!} />
          <DataLabels maintenanceDetailsData={maintenanceDetailsData!} />
          <Suppliers
            supplierData={supplierData}
            maintenanceId={maintenanceId}
            handleGetMaintenanceSupplier={handleGetMaintenanceSupplier}
          />
          <Comments
            maintenanceId={maintenanceId}
            setLoading={setLoading}
            OFFLINE_QUEUE_KEY={OFFLINE_QUEUE_KEY}
            onCreateMaintenanceActivity={handleGetMaintenanceHistoryActivities}
          />
          <History historyActivitiesData={historyActivitiesData} />
          <Costs maintenanceDetailsData={maintenanceDetailsData} cost={cost} setCost={setCost} />
          <Attachments
            maintenanceDetailsData={maintenanceDetailsData}
            files={files}
            images={images}
            setFiles={setFiles}
            setImages={setImages}
          />
          <CallToActions
            maintenanceId={maintenanceId}
            maintenanceDetailsData={maintenanceDetailsData}
            OFFLINE_QUEUE_KEY={OFFLINE_QUEUE_KEY}
            files={files}
            images={images}
            cost={cost}
            setFiles={setFiles}
            setImages={setImages}
            setCost={setCost}
            setLoading={setLoading}
          />
        </ScreenWithCloseButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
