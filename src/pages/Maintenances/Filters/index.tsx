import { useState } from "react";
import { View } from "react-native";

import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { DateTimeInput } from "@/components/DateTimeInput";
import { LabelInput } from "@/components/LabelInput";
import { MultiSelect } from "@/components/MultiSelect";
import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { emptyFilters, IFilter } from "../utils";
import { styles } from "./styles";

// TODO: get correct values
const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

interface FiltersProps {
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
}

export const Filters = ({ filters, setFilters }: FiltersProps) => {
  const { closeBottomSheet } = useBottomSheet();

  const [filtersCache, setFiltersCache] = useState<IFilter>(filters);

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
      <LabelInput
        value={filtersCache.search}
        onChangeText={(search) => setFiltersCache({ ...filtersCache, search })}
        label="Buscar"
        placeholder="Procurar por algum termo"
        isBottomSheetInput
      />

      <LabelInput label="Usuário">
        <MultiSelect
          data={data}
          value={filtersCache.selectedUsers}
          onChange={(selectedUsers) => setFiltersCache({ ...filtersCache, selectedUsers })}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Status">
        <MultiSelect
          data={data}
          value={filtersCache.selectedStatus}
          onChange={(selectedStatus) => setFiltersCache({ ...filtersCache, selectedStatus })}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Categoria">
        <MultiSelect
          data={data}
          value={filtersCache.selectedCategories}
          onChange={(selectedCategories) => setFiltersCache({ ...filtersCache, selectedCategories })}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Prioridade">
        <MultiSelect
          data={data}
          value={filtersCache.selectedPriorities}
          onChange={(selectedPriorities) => setFiltersCache({ ...filtersCache, selectedPriorities })}
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
