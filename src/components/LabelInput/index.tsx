import { StyleProp, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

import { commonStyles } from "../common-styles";
import { styles } from "./styles";

interface LabelInputProps extends TextInputProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  inputTextStyle?: StyleProp<TextStyle>;
  textPosition?: "left" | "right";
  containerOnTouchEnd?: () => void;
  children?: React.ReactNode;
  isBottomSheetInput?: boolean;
  error?: string;
}

export const LabelInput = ({
  label,
  style,
  inputTextStyle,
  textPosition = "left",
  containerOnTouchEnd,
  children,
  isBottomSheetInput = false,
  error,
  ...props
}: LabelInputProps) => {
  const InputComponent = isBottomSheetInput ? BottomSheetTextInput : TextInput;

  return (
    <View style={style} onTouchEnd={containerOnTouchEnd}>
      {textPosition === "left" && <Text style={styles.label}>{label}</Text>}

      {children || (
        <InputComponent placeholderTextColor="gray" style={[commonStyles.input, inputTextStyle]} {...props} />
      )}

      {textPosition === "right" && <Text style={styles.label}>{label}</Text>}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
