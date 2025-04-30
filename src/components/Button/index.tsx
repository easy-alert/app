import { ActivityIndicator, StyleProp, Text, TextStyle, TouchableOpacity, TouchableOpacityProps } from "react-native";

import { styles } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  labelStyle?: StyleProp<TextStyle>;
}

export const PrimaryButton = ({ label, style, labelStyle, loading = false, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.primaryButton, style]} {...props}>
      <Text style={[styles.primaryButtonLabel, labelStyle]}>{label}</Text>

      {loading && <ActivityIndicator size="small" color="#fff" style={styles.primaryButtonLoading} />}
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({ label, style, labelStyle, loading = false, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.secondaryButton, style]} {...props}>
      <Text style={[styles.secondaryButtonLabel, labelStyle]}>{label}</Text>

      {loading && <ActivityIndicator size="small" color="#75c5ff" style={styles.secondaryButtonLoading} />}
    </TouchableOpacity>
  );
};
