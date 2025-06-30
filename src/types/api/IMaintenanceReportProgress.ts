import { IRemoteFile } from "./IRemoteFile";

export interface IMaintenanceReportProgress {
  progress: {
    ReportAnnexesProgress: IRemoteFile[];
    ReportImagesProgress: IRemoteFile[];
    cost: number;
  } | null;
}
