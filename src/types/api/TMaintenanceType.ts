export const MAINTENANCE_TYPE = [
  {
    value: "common",
    label: "preventiva",
  },
  {
    value: "occasional",
    label: "avulsa",
  },
] as const;
export type TMaintenanceType = (typeof MAINTENANCE_TYPE)[number]["value"];
export type TMaintenanceTypeLabel = (typeof MAINTENANCE_TYPE)[number]["label"];
