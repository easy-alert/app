import { ActivityIndicator } from "react-native";
import { MultiSelect as MultiSelectComponent } from "react-native-element-dropdown";
import { MultiSelectProps } from "react-native-element-dropdown/lib/typescript/components/MultiSelect/model";

import { commonStyles, disabledIconColor, iconColor } from "../common-styles";
import { styles } from "./styles";

interface Props<T> extends MultiSelectProps<T> {
  loading?: boolean;
}

export function MultiSelect<T>({ data, loading = false, ...props }: Props<T>) {
  const disable = data.length === 0;

  return (
    <MultiSelectComponent
      data={data}
      disable={disable}
      style={commonStyles.input}
      placeholderStyle={commonStyles.inputPlaceholderLabel}
      itemTextStyle={commonStyles.inputContentLabel}
      selectedStyle={styles.selectedStyle}
      selectedTextStyle={commonStyles.inputContentLabel}
      iconColor={disable ? disabledIconColor : iconColor}
      containerStyle={commonStyles.dropdownContainer}
      inside
      maxHeight={300}
      mode="default"
      renderRightIcon={loading ? () => <ActivityIndicator size="small" color={iconColor} /> : undefined}
      {...props}
    />
  );
}
