import type { IAnnexesAndImages } from '.';

export interface IMaintenanceReportProgress {
  id?: string;
  cost: number;
  observation?: string;
  ReportAnnexes?: IAnnexesAndImages[];
  ReportImages?: IAnnexesAndImages[];
}
