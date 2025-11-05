import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { PageWithHeaderLayout } from "@/layouts/PageWithHeaderLayout";

import type { MaintenanceDetailsParams, ProtectedNavigation } from "@/routes/navigation";

import { getMaintenanceDetails } from "@/services/queries/getMaintenanceDetails";
import { getMaintenanceHistoryActivities } from "@/services/queries/getMaintenanceHistoryActivities";
import { getMaintenanceHistorySupplier } from "@/services/queries/getMaintenanceHistorySupplier";

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
import { EditMaintenanceHistory } from "./EditMaintenanceHistory";
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

  const [isEditingReport, setIsEditingReport] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isFinished, canReport } = getMaintenanceFlags({
    maintenanceStatus: maintenanceDetails?.MaintenancesStatus.name,
    canReport: maintenanceDetails?.canReport,
  });

  const handleChangeEditingReport = (state: boolean) => {
    if (!state) {
      loadData();
    }

    setIsEditingReport(state);
  };

  const handleGetMaintenanceDetails = async () => {
    const maintenanceDetails = await getMaintenanceDetails({
      maintenanceHistoryId: maintenanceId,
    });

    if (maintenanceDetails) {
      setMaintenanceDetails(maintenanceDetails);

      if (
        maintenanceDetails.MaintenancesStatus.name === "completed" ||
        maintenanceDetails.MaintenancesStatus.name === "overdue"
      ) {
        const maintenanceReport =
          (maintenanceDetails.MaintenanceReport?.length || 0) > 0 ? maintenanceDetails.MaintenanceReport?.[0] : null;

        setCost(maintenanceReport?.cost.toString() || "0,00");
        setRemoteFiles(maintenanceReport?.ReportAnnexes || []);
        setRemoteImages(maintenanceReport?.ReportImages || []);
      } else {
        const maintenanceReportProgress =
          (maintenanceDetails.MaintenanceReportProgress?.length || 0) > 0
            ? maintenanceDetails.MaintenanceReportProgress?.[0]
            : null;

        setCost(maintenanceReportProgress?.cost.toString() || "0,00");
        setRemoteFiles(maintenanceReportProgress?.ReportAnnexesProgress || []);
        setRemoteImages(maintenanceReportProgress?.ReportImagesProgress || []);
      }
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

  const openEditMaintenanceHistory = () => {
    openBottomSheet({
      content: <EditMaintenanceHistory maintenanceDetails={maintenanceDetails} onFinishEditing={loadData} />,
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
        onEdit={openEditMaintenanceHistory}
        onShare={openShareMaintenance}
      >
        <Header maintenanceDetails={maintenanceDetails} />
        <DataLabels maintenanceDetails={maintenanceDetails} />
        <Users maintenanceDetails={maintenanceDetails} />
        <Suppliers
          supplier={supplier}
          maintenanceId={maintenanceId}
          getMaintenanceSupplier={handleGetMaintenanceSupplier}
          enableSupplierButton={canReport && (isEditingReport || !isFinished)}
        />
        <Comments
          maintenanceId={maintenanceId}
          setLoading={setLoading}
          getMaintenanceHistoryActivities={handleGetMaintenanceHistoryActivities}
          enableComments={canReport && (isEditingReport || !isFinished)}
        />
        <History historyActivities={historyActivities} />
        {canReport && (
          <>
            <Costs
              maintenanceDetails={maintenanceDetails}
              cost={cost}
              setCost={setCost}
              enableCost={canReport && (isEditingReport || !isFinished)}
            />
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
              enableAttachments={canReport && (isEditingReport || !isFinished)}
            />

            <CallToActions
              maintenanceDetails={maintenanceDetails}
              localFiles={localFiles}
              localImages={localImages}
              remoteFiles={remoteFiles}
              remoteImages={remoteImages}
              cost={cost}
              setLoading={setLoading}
              isFinished={isFinished}
              isEditingReport={isEditingReport}
              handleChangeEditingReport={handleChangeEditingReport}
            />
          </>
        )}
      </PageWithHeaderLayout>
    </KeyboardAvoidingView>
  );
};
