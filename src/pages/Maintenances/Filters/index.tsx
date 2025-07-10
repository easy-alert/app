import { useState } from "react";
import { View } from "react-native";

import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { DateTimeInput } from "@/components/DateTimeInput";
import { LabelInput } from "@/components/LabelInput";
import { MultiSelect } from "@/components/MultiSelect";

import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { emptyFilters } from "@/utils/filters";
import { maintenanceStatus } from "@/utils/getStatus";

import { MAINTENANCE_TYPE } from "@/types/api/TMaintenanceType";
import { PRIORITY_NAME } from "@/types/api/TPriorityName";
import type { AvailableFilter } from "@/types/utils/AvailableFilter";
import type { KanbanFilter } from "@/types/utils/Filter";

import { styles } from "./styles";

interface FiltersProps {
  filters: KanbanFilter;
  availableBuildings: AvailableFilter[];
  availableUsers: AvailableFilter[];
  availableCategories: AvailableFilter[];
  setFilters: (filters: KanbanFilter) => void;
}

export const Filters = ({
  filters,
  availableBuildings,
  availableUsers,
  availableCategories,
  setFilters,
}: FiltersProps) => {
  const { closeBottomSheet } = useBottomSheet();

  const [filtersCache, setFiltersCache] = useState<KanbanFilter>(filters);

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    closeBottomSheet();
  };

  const handleApplyFilters = () => {
    setFilters(filtersCache);
    closeBottomSheet();
  };

  return (
    <View style={styles.container}>
      <LabelInput label="Edificação">
        <MultiSelect
          data={availableBuildings}
          value={filtersCache.selectedBuildings}
          onChange={(selectedBuildings) => setFiltersCache({ ...filtersCache, selectedBuildings })}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput
        value={filtersCache.search}
        onChangeText={(search) => setFiltersCache({ ...filtersCache, search })}
        label="Buscar"
        placeholder="Procurar por algum termo"
        isBottomSheetInput
      />

      <LabelInput label="Usuário">
        <MultiSelect
          data={availableUsers}
          value={filtersCache.selectedUsers}
          onChange={(selectedUsers) => setFiltersCache({ ...filtersCache, selectedUsers })}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Status">
        <MultiSelect
          data={maintenanceStatus}
          value={filtersCache.selectedStatus}
          onChange={(selectedStatus) => setFiltersCache({ ...filtersCache, selectedStatus })}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Categoria">
        <MultiSelect
          data={availableCategories}
          value={filtersCache.selectedCategories}
          onChange={(selectedCategories) => setFiltersCache({ ...filtersCache, selectedCategories })}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Prioridade">
        <MultiSelect
          data={PRIORITY_NAME.map((priority) => ({
            label: capitalizeFirstLetter(priority.label),
            value: priority.name,
          }))}
          value={filtersCache.selectedPriorityNames}
          onChange={(selectedPriorityNames) => setFiltersCache({ ...filtersCache, selectedPriorityNames })}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Tipo">
        <MultiSelect
          data={MAINTENANCE_TYPE.map((type) => ({
            label: capitalizeFirstLetter(type.label),
            value: type.value,
          }))}
          value={filtersCache.selectedTypes}
          onChange={(selectedTypes) => setFiltersCache({ ...filtersCache, selectedTypes })}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Data inicial">
        <DateTimeInput
          value={new Date(filtersCache.startDate).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
          onSelectDate={(selectedDate) => setFiltersCache({ ...filtersCache, startDate: selectedDate.toISOString() })}
        />
      </LabelInput>

      <LabelInput label="Data final">
        <DateTimeInput
          value={new Date(filtersCache.endDate).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
          onSelectDate={(selectedDate) => setFiltersCache({ ...filtersCache, endDate: selectedDate.toISOString() })}
        />
      </LabelInput>

      <View style={styles.footerContainer}>
        <SecondaryButton label="Limpar filtros" style={styles.footerButton} onPress={handleClearFilters} />
        <PrimaryButton label="Filtrar" style={styles.footerButton} onPress={handleApplyFilters} />
      </View>
    </View>
  );
};
