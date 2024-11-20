export interface Maintenance {
  id: string;
  element: string;
  activity: string;
  status: string; // Pode ser 'expired', 'pending', 'completed', 'overdue', etc.
  cantReportExpired?: boolean;
  date: string; // ISO 8601 string
  dueDate: string; // ISO 8601 string
  label: string;
  type: string; // Exemplo: 'common'
  inProgress: boolean;
}

export interface KanbanColumn {
  status: string; // Exemplo: 'Vencidas', 'Pendentes', etc.
  maintenances: Maintenance[];
}

export interface FilterCategory {
  id: string;
  name: string;
}

export interface FilterStatus {
  name: string; // Exemplo: 'completed'
  label: string; // Exemplo: 'concluídas'
}

export interface FilterMonth {
  monthNumber: string; // Exemplo: '01'
  label: string; // Exemplo: 'janeiro'
}

export interface Filters {
  years: string[]; // Exemplo: ['2024', '2025']
  months: FilterMonth[];
  status: FilterStatus[];
  categories: FilterCategory[];
}

export interface ApiResponse {
  buildingName: string; // Nome do edifício
  kanban: KanbanColumn[]; // Colunas do Kanban
  Filters: Filters; // Filtros disponíveis
}
