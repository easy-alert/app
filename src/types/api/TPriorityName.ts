export const PRIORITY_NAME = [
  {
    value: "low",
    label: "baixa",
  },
  {
    value: "medium",
    label: "média",
  },
  {
    value: "high",
    label: "alta",
  },
] as const;
export type TPriorityName = (typeof PRIORITY_NAME)[number]["value"];
export type TPriorityNameLabel = (typeof PRIORITY_NAME)[number]["label"];
