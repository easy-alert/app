import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";

import { PageLayout } from "@/components/PageLayout";
import { PageWithHeader } from "@/components/PageWithHeader";
import { useBottomSheet } from "@/contexts/BottomSheetContext";
import type { MaintenanceDetailsParams, ProtectedNavigation } from "@/routes/navigation";
import { getMaintenanceDetails } from "@/services/getMaintenanceDetails";
import { getMaintenanceHistoryActivities } from "@/services/getMaintenanceHistoryActivities";
import { getMaintenanceHistorySupplier } from "@/services/getMaintenanceHistorySupplier";
import { getMaintenanceReportProgress } from "@/services/getMaintenanceReportProgress";
import type { IMaintenance } from "@/types/api/IMaintenance";
import type { IMaintenanceHistoryActivities } from "@/types/api/IMaintenanceHistoryActivities";
import type { IRemoteFile } from "@/types/api/IRemoteFile";
import type { ISupplier } from "@/types/api/ISupplier";
import type { LocalFile } from "@/types/utils/LocalFile";

import { Attachments } from "./Attachments";
import { CallToActions } from "./CallToActions";
import { Comments } from "./Comments";
import { Costs } from "./Costs";
import { DataLabels } from "./DataLabels";
import { EditForm } from "./EditForm";
import { Header } from "./Header";
import { History } from "./History";
import { styles } from "./styles";
import { Suppliers } from "./Suppliers";
import { Users } from "./Users";

export const MaintenanceDetails = () => {
  const navigation = useNavigation<ProtectedNavigation>();
  const route = useRoute();
  const { maintenanceId } = route.params as MaintenanceDetailsParams;
  const { openBottomSheet } = useBottomSheet();

  const [maintenanceDetails, setMaintenanceDetails] = useState<IMaintenance>();
  const [supplier, setSupplier] = useState<ISupplier>();
  const [historyActivities, setHistoryActivities] = useState<IMaintenanceHistoryActivities>();
  const [cost, setCost] = useState("0,00");

  // TODO: separar em dois estados diferentes
  const [files, setFiles] = useState<(IRemoteFile | LocalFile)[]>([]);
  const [images, setImages] = useState<(IRemoteFile | LocalFile)[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetMaintenanceDetails = async () => {
    try {
      const responseData = await getMaintenanceDetails({
        maintenanceHistoryId: maintenanceId,
      });

      if (responseData) {
        setMaintenanceDetails(responseData);
      }
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

      if (responseData) {
        setHistoryActivities(responseData);
      }
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

  useEffect(() => {
    loadData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maintenanceId]);

  if (loading || !maintenanceDetails) {
    return <ActivityIndicator size="large" color="#ff3535" style={styles.loading} />;
  }

  const openEditForm = () => {
    openBottomSheet({
      content: <EditForm maintenanceDetails={maintenanceDetails} onFinishEditing={loadData} />,
    });
  };

  const showEditFormButton =
    maintenanceDetails.MaintenancesStatus.name !== "completed" &&
    maintenanceDetails.MaintenancesStatus.name !== "overdue";

  return (
    <PageLayout>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <PageWithHeader
          title="Enviar relato"
          onClose={() => navigation.goBack()}
          isScrollView
          onEdit={showEditFormButton ? openEditForm : undefined}
        >
          <Header maintenanceDetails={maintenanceDetails} />
          <DataLabels maintenanceDetails={maintenanceDetails} />
          <Users maintenanceDetails={maintenanceDetails} />
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
        </PageWithHeader>
      </KeyboardAvoidingView>
    </PageLayout>
  );
};
