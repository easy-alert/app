import { ScrollView, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { styles } from "./styles";

interface PageWithHeaderLayoutProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onEdit?: () => void;
  withPadding?: boolean;
  isScrollView?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PageWithHeaderLayout = ({
  title,
  children,
  onClose,
  onEdit,
  withPadding = true,
  isScrollView = false,
  style,
}: PageWithHeaderLayoutProps) => {
  return (
    <Container withPadding={withPadding} isScrollView={isScrollView} style={style}>
      <View style={[styles.header, !withPadding && styles.contentPadding]}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.buttonContainer}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.button}>
              <Icon name="edit-2" size={20} color="#b21d1d" />
            </TouchableOpacity>
          )}

          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Icon name="x" size={24} color="#b21d1d" />
            </TouchableOpacity>
          )}
        </View>
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
