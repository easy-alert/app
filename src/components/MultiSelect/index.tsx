import { MultiSelect as MultiSelectComponent } from "react-native-element-dropdown";
import { MultiSelectProps } from "react-native-element-dropdown/lib/typescript/components/MultiSelect/model";

import { commonStyles } from "../common-styles";
import { styles } from "./styles";

export function MultiSelect<T>(props: MultiSelectProps<T>) {
  return (
    <MultiSelectComponent
      style={commonStyles.input}
      placeholderStyle={commonStyles.inputPlaceholderLabel}
      itemTextStyle={commonStyles.inputContentLabel}
      selectedStyle={styles.selectedStyle}
      selectedTextStyle={commonStyles.inputContentLabel}
      iconStyle={commonStyles.inputIconImageType}
      containerStyle={commonStyles.dropdownContainer}
      inside
      maxHeight={300}
      mode="default"
      {...props}
    />
  );
}
