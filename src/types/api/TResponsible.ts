export const RESPONSIBLE = [
  { label: "Equipe de manutenção local" },
  { label: "Equipe capacitada" },
  { label: "Equipe Especializada" },
] as const;
export type TResponsible = (typeof RESPONSIBLE)[number]["label"];
