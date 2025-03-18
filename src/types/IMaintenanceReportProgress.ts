import type { IAnnexesAndImages } from "@/types/IAnnexesAndImages";

export interface IMaintenanceReportProgress {
  id?: string;
  cost: number;
  observation?: string;
  ReportAnnexes?: IAnnexesAndImages[];
  ReportImages?: IAnnexesAndImages[];
}
