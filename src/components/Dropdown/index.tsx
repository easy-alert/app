import { Dropdown as DropdownElement } from "react-native-element-dropdown";
import { DropdownProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";

import { commonStyles, disabledIconColor, iconColor } from "../common-styles";

export function Dropdown<T>({ data, ...props }: DropdownProps<T>) {
  const disable = data.length === 0;

  return (
    <DropdownElement
      data={data}
      disable={disable}
      style={commonStyles.input}
      placeholderStyle={commonStyles.inputPlaceholderLabel}
      selectedTextStyle={commonStyles.inputContentLabel}
      itemTextStyle={commonStyles.inputContentLabel}
      iconColor={disable ? disabledIconColor : iconColor}
      containerStyle={commonStyles.dropdownContainer}
      maxHeight={300}
      {...props}
    />
  );
}
