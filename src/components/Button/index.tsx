import { StyleProp, Text, TextStyle, TouchableOpacity, TouchableOpacityProps } from "react-native";

import { styles } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
}

export const PrimaryButton = ({ label, style, labelStyle, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.primaryButton, style]} {...props}>
      <Text style={[styles.primaryButtonLabel, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({ label, style, labelStyle, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.secondaryButton, style]} {...props}>
      <Text style={[styles.secondaryButtonLabel, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};
