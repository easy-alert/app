import BottomSheetComponent, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ForwardedRef, forwardRef, ReactNode, useCallback } from "react";
import { useWindowDimensions } from "react-native";

import { styles } from "./styles";

interface BottomSheetProps {
  content: ReactNode;
  footer?: ReactNode;
  fullSize?: boolean;
  onClose: () => void;
}

export const BottomSheet = forwardRef(
  ({ content, fullSize, footer, onClose }: BottomSheetProps, ref: ForwardedRef<BottomSheetComponent>) => {
    const { height } = useWindowDimensions();

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} pressBehavior="close" />
      ),
      [],
    );

    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => (
        <BottomSheetFooter {...props} style={styles.footerContainer}>
          {footer}
        </BottomSheetFooter>
      ),
      [footer],
    );

    return (
      <BottomSheetComponent
        ref={ref}
        enableDynamicSizing={!fullSize}
        enablePanDownToClose
        maxDynamicContentSize={fullSize ? undefined : height * 0.7}
        snapPoints={fullSize ? [height * 0.9] : undefined}
        index={-1}
        onClose={onClose}
        backdropComponent={renderBackdrop}
        footerComponent={footer ? renderFooter : undefined}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.scrollViewContentContainer}
          style={styles.scrollViewContainer}
        >
          {content}
        </BottomSheetScrollView>
      </BottomSheetComponent>
    );
  },
);

BottomSheet.displayName = "BottomSheet";
