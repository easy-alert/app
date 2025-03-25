import { StyleProp, TextInput, View, ViewStyle } from "react-native";

import { useState } from "react";

import Icon from "react-native-vector-icons/Feather";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { styles } from "./styles";

interface DateTimeInputProps {
  value?: string;
  onSelectDate?: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
}

export const DateTimeInput = ({ value, onSelectDate, style }: DateTimeInputProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        display="inline"
        onConfirm={(selectedDate) => {
          setShowDatePicker(false);
          onSelectDate?.(selectedDate);
        }}
        onCancel={() => setShowDatePicker(false)}
        themeVariant={"light"}
      />

      <TextInput style={style} value={value} placeholder="dd/mm/aaaa" editable={false} />

      <Icon name="calendar" size={24} color="#b21d1d" style={styles.icon} onPress={() => setShowDatePicker(true)} />
    </View>
  );
};
