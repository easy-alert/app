import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { PageWithHeaderLayout } from "@/layouts/PageWithHeaderLayout";

import type { MaintenanceDetailsParams, ProtectedNavigation } from "@/routes/navigation";

import { getMaintenanceDetails } from "@/services/queries/getMaintenanceDetails";
import { getMaintenanceHistoryActivities } from "@/services/queries/getMaintenanceHistoryActivities";
import { getMaintenanceHistorySupplier } from "@/services/queries/getMaintenanceHistorySupplier";
import { getMaintenanceReportProgress } from "@/services/queries/getMaintenanceReportProgress";

import { getMaintenanceFlags } from "@/utils/getMaintenanceFlags";

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
import { ShareMaintenance } from "./ShareMaintenance";
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

  const [remoteFiles, setRemoteFiles] = useState<IRemoteFile[]>([]);
  const [remoteImages, setRemoteImages] = useState<IRemoteFile[]>([]);
  const [localFiles, setLocalFiles] = useState<LocalFile[]>([]);
  const [localImages, setLocalImages] = useState<LocalFile[]>([]);
  const [loading, setLoading] = useState(false);

  const { isCompleted, isOverdue, canReport } = getMaintenanceFlags({
    canReport: maintenanceDetails?.canReport,
  });

  const handleGetMaintenanceDetails = async () => {
    const maintenanceDetails = await getMaintenanceDetails({
      maintenanceHistoryId: maintenanceId,
    });

    if (maintenanceDetails) {
      setMaintenanceDetails(maintenanceDetails);
    }
  };

  const handleGetMaintenanceReportProgress = async () => {
    const maintenanceReportProgress = await getMaintenanceReportProgress({
      maintenanceHistoryId: maintenanceId,
    });

    if (maintenanceReportProgress?.progress) {
      const cost = String(maintenanceReportProgress.progress.cost / 100).replace(".", ",");
      setCost(cost);
      setRemoteFiles(maintenanceReportProgress.progress.ReportAnnexesProgress);
      setRemoteImages(maintenanceReportProgress.progress.ReportImagesProgress);
    }
  };

  const handleGetMaintenanceHistoryActivities = async () => {
    const historyActivities = await getMaintenanceHistoryActivities({
      maintenanceHistoryId: maintenanceId,
    });

    if (historyActivities) {
      setHistoryActivities(historyActivities);
    }
  };

  const handleGetMaintenanceSupplier = async () => {
    const suppliers = await getMaintenanceHistorySupplier({
      maintenanceHistoryId: maintenanceId,
    });

    if (suppliers.length > 0) {
      setSupplier(suppliers[0]);
    } else {
      setSupplier(undefined);
    }
  };

  const loadData = async () => {
    setLoading(true);

    // TODO: implantar em paralelo
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

  const openShareMaintenance = () => {
    openBottomSheet({
      content: <ShareMaintenance maintenanceId={maintenanceId} />,
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <PageWithHeaderLayout
        title="Enviar relato"
        onClose={() => navigation.goBack()}
        isScrollView
        onEdit={openEditForm}
        onShare={openShareMaintenance}
      >
        <Header maintenanceDetails={maintenanceDetails} />
        <DataLabels maintenanceDetails={maintenanceDetails} />
        <Users maintenanceDetails={maintenanceDetails} />
        <Suppliers
          supplier={supplier}
          maintenanceId={maintenanceId}
          getMaintenanceSupplier={handleGetMaintenanceSupplier}
          enableSupplierButton={canReport && (!isCompleted || !isOverdue)}
        />
        <Comments
          maintenanceId={maintenanceId}
          setLoading={setLoading}
          getMaintenanceHistoryActivities={handleGetMaintenanceHistoryActivities}
          enableComments={canReport && (!isCompleted || !isOverdue)}
        />
        <History historyActivities={historyActivities} />
        {maintenanceDetails.canReport && (
          <>
            <Costs maintenanceDetails={maintenanceDetails} cost={cost} setCost={setCost} />
            <Attachments
              maintenanceDetails={maintenanceDetails}
              remoteFiles={remoteFiles}
              remoteImages={remoteImages}
              setRemoteFiles={setRemoteFiles}
              setRemoteImages={setRemoteImages}
              localFiles={localFiles}
              localImages={localImages}
              setLocalFiles={setLocalFiles}
              setLocalImages={setLocalImages}
            />

            <CallToActions
              maintenanceDetails={maintenanceDetails}
              localFiles={localFiles}
              localImages={localImages}
              remoteFiles={remoteFiles}
              remoteImages={remoteImages}
              cost={cost}
              setLoading={setLoading}
            />
          </>
        )}
      </PageWithHeaderLayout>
    </KeyboardAvoidingView>
  );
};
