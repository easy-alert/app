import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";

import { PageLayout } from "@/components/PageLayout";
import { ScreenWithCloseButton } from "@/components/ScreenWithCloseButton";
import type { MaintenanceDetailsParams, ProtectedNavigation } from "@/routes/navigation";
import { getMaintenanceDetails } from "@/services/getMaintenanceDetails";
import { getMaintenanceHistoryActivities } from "@/services/getMaintenanceHistoryActivities";
import { getMaintenanceHistorySupplier } from "@/services/getMaintenanceHistorySupplier";
import { getMaintenanceReportProgress } from "@/services/getMaintenanceReportProgress";
import type { ILocalFile } from "@/types/ILocalFile";
import type { IMaintenance } from "@/types/IMaintenance";
import type { IMaintenanceHistoryActivities } from "@/types/IMaintenanceHistoryActivities";
import type { IRemoteFile } from "@/types/IRemoteFile";
import type { ISupplier } from "@/types/ISupplier";

import { Attachments } from "./Attachments";
import { CallToActions } from "./CallToActions";
import { Comments } from "./Comments";
import { Costs } from "./Costs";
import { DataLabels } from "./DataLabels";
import { Header } from "./Header";
import { History } from "./History";
import { styles } from "./styles";
import { Suppliers } from "./Suppliers";

export const MaintenanceDetails = () => {
  const navigation = useNavigation<ProtectedNavigation>();
  const route = useRoute();
  const { maintenanceId } = route.params as MaintenanceDetailsParams;

  const [maintenanceDetails, setMaintenanceDetails] = useState<IMaintenance>();
  const [supplier, setSupplier] = useState<ISupplier>();
  const [historyActivities, setHistoryActivities] = useState<IMaintenanceHistoryActivities>();
  const [cost, setCost] = useState("0,00");
  const [files, setFiles] = useState<(IRemoteFile | ILocalFile)[]>([]);
  const [images, setImages] = useState<(IRemoteFile | ILocalFile)[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetMaintenanceDetails = async () => {
    try {
      const responseData = await getMaintenanceDetails({
        maintenanceHistoryId: maintenanceId,
      });

      setMaintenanceDetails(responseData);
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

      setHistoryActivities(responseData);
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
        setSupplier(undefined);
        return;
      }

      setSupplier(responseData?.suppliers[0]);
    } catch (error) {
      console.error("🚀 ~ handleGetMaintenanceSupplier ~ error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
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

  if (loading || !maintenanceDetails) {
    return <ActivityIndicator size="large" color="#ff3535" style={styles.loading} />;
  }

  return (
    <PageLayout>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScreenWithCloseButton title="Enviar relato" onClose={() => navigation.goBack()} isScrollView>
          <Header maintenanceDetails={maintenanceDetails} />
          <DataLabels maintenanceDetails={maintenanceDetails} />
          <Suppliers
            supplier={supplier}
            maintenanceId={maintenanceId}
            getMaintenanceSupplier={handleGetMaintenanceSupplier}
          />
          <Comments
            maintenanceId={maintenanceId}
            setLoading={setLoading}
            getMaintenanceHistoryActivities={handleGetMaintenanceHistoryActivities}
          />
          <History historyActivities={historyActivities} />
          {maintenanceDetails.canReport && (
            <>
              <Costs maintenanceDetails={maintenanceDetails} cost={cost} setCost={setCost} />
              <Attachments
                maintenanceDetails={maintenanceDetails}
                files={files}
                images={images}
                setFiles={setFiles}
                setImages={setImages}
              />

              <CallToActions
                maintenanceDetails={maintenanceDetails}
                files={files}
                images={images}
                cost={cost}
                setFiles={setFiles}
                setImages={setImages}
                setCost={setCost}
                setLoading={setLoading}
              />
            </>
          )}
        </ScreenWithCloseButton>
      </KeyboardAvoidingView>
    </PageLayout>
  );
};
