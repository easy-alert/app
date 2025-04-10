import React, { useState } from "react";
import { View } from "react-native";

import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { DateTimeInput } from "@/components/DateTimeInput";
import { LabelInput } from "@/components/LabelInput";
import { MultiSelect } from "@/components/MultiSelect";
import { useBottomSheet } from "@/contexts/BottomSheetContext";

import { styles } from "./styles";

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

export const Filters = () => {
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString());
  const [endDate, setEndDate] = useState<string>(new Date().toISOString());

  return (
    <View style={styles.container}>
      <LabelInput
        value={search}
        onChangeText={setSearch}
        label="Buscar"
        placeholder="Procurar por algum termo"
        isBottomSheetInput
      />

      <LabelInput label="Usuário">
        <MultiSelect
          data={data}
          value={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Status">
        <MultiSelect
          data={data}
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Categoria">
        <MultiSelect
          data={data}
          value={selectedCategories}
          onChange={setSelectedCategories}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Prioridade">
        <MultiSelect
          data={data}
          value={selectedPriorities}
          onChange={setSelectedPriorities}
          placeholder="Selecione"
          labelField="label"
          valueField="value"
        />
      </LabelInput>

      <LabelInput label="Data inicial">
        <DateTimeInput
          value={new Date(startDate).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
          onSelectDate={(selectedDate) => setStartDate(selectedDate.toISOString())}
        />
      </LabelInput>

      <LabelInput label="Data final">
        <DateTimeInput
          value={new Date(endDate).toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
          onSelectDate={(selectedDate) => setEndDate(selectedDate.toISOString())}
        />
      </LabelInput>
    </View>
  );
};

export const FiltersFooter = () => {
  const { closeBottomSheet } = useBottomSheet();

  return (
    <View style={styles.footerContainer}>
      <SecondaryButton label="Limpar filtros" style={styles.footerButton} onPress={closeBottomSheet} />
      <PrimaryButton label="Filtrar" style={styles.footerButton} onPress={closeBottomSheet} />
    </View>
  );
};
