import { Dropdown as DropdownElement } from "react-native-element-dropdown";
import { DropdownProps } from "react-native-element-dropdown/lib/typescript/components/Dropdown/model";

import { styles } from "./styles";

export function Dropdown<T>(props: DropdownProps<T>) {
  return (
    <DropdownElement
      placeholderStyle={[styles.labels, styles.placeholder]}
      selectedTextStyle={styles.labels}
      itemTextStyle={styles.labels}
      style={styles.container}
      iconColor="#b21d1d"
      maxHeight={300}
      {...props}
    />
  );
}
