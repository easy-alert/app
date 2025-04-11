import { ScrollView, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

interface ScreenWithCloseButtonProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  withPadding?: boolean;
  isScrollView?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ScreenWithCloseButton = ({
  title,
  onClose,
  children,
  withPadding = true,
  isScrollView = false,
  style,
}: ScreenWithCloseButtonProps) => {
  return (
    <Container withPadding={withPadding} isScrollView={isScrollView} style={style}>
      <View style={[styles.header, !withPadding && styles.contentPadding]}>
        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Icon name="x" size={24} color="#b21d1d" />
        </TouchableOpacity>
      </View>

      {children}
    </Container>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  withPadding: boolean;
  isScrollView: boolean;
  style?: StyleProp<ViewStyle>;
}

const Container = ({ children, withPadding, isScrollView, style }: ContainerProps) => {
  if (isScrollView) {
    return (
      <ScrollView contentContainerStyle={[styles.scrollViewContainer, withPadding && styles.contentPadding, style]}>
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.viewContainer, withPadding && styles.contentPadding, style]}>{children}</View>;
};
