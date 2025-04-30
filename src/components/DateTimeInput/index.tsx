import { useState } from "react";
import { StyleProp, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/Feather";

import { commonStyles, iconColor } from "../common-styles";
import { styles } from "./styles";

interface DateTimeInputProps {
  value?: string;
  onSelectDate?: (date: Date) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const DateTimeInput = ({ value, onSelectDate, style, disabled = false }: DateTimeInputProps) => {
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

      <TextInput style={[commonStyles.input, style]} value={value} placeholder="dd/mm/aaaa" editable={false} />

      <TouchableOpacity style={styles.iconButtonContainer} onPress={() => setShowDatePicker(true)} disabled={disabled}>
        <Icon name="calendar" size={20} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};
