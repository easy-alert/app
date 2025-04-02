import { View, Text, TextInput, TextInputProps, StyleProp, ViewStyle, TextStyle } from "react-native";

import { styles } from "./styles";

interface LabelInputProps extends TextInputProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const LabelInput = ({ label, style, inputTextStyle, children, ...props }: LabelInputProps) => {
  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>

      {children || <TextInput placeholderTextColor="gray" style={[styles.input, inputTextStyle]} {...props} />}
    </View>
  );
};
