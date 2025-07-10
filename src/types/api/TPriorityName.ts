export const PRIORITY_NAME = [
  {
    name: "low",
    label: "baixa",
  },
  {
    name: "medium",
    label: "média",
  },
  {
    name: "high",
    label: "alta",
  },
] as const;
export type TPriorityName = (typeof PRIORITY_NAME)[number]["name"];
export type TPriorityNameLabel = (typeof PRIORITY_NAME)[number]["label"];
