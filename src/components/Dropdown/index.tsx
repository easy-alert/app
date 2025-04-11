import { Dropdown as DropdownElement } from "react-native-element-dropdown";
import { DropdownProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";

import { commonStyles } from "../common-styles";

export function Dropdown<T>(props: DropdownProps<T>) {
  return (
    <DropdownElement
      style={commonStyles.input}
      placeholderStyle={commonStyles.inputPlaceholderLabel}
      selectedTextStyle={commonStyles.inputContentLabel}
      itemTextStyle={commonStyles.inputContentLabel}
      iconStyle={commonStyles.inputIconImageType}
      containerStyle={commonStyles.dropdownContainer}
      maxHeight={300}
      {...props}
    />
  );
}
