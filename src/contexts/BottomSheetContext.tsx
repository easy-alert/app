import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";

interface OpenBottomSheetProps {
  content: ReactNode;
  fullSize?: boolean;
}

interface BottomSheetContextData {
  openBottomSheet: (props: OpenBottomSheetProps) => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext({} as BottomSheetContextData);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [fullSize, setFullSize] = useState(false);

  const { height } = useWindowDimensions();

  const openBottomSheet = ({ content, fullSize }: OpenBottomSheetProps) => {
    setContent(content);
    setFullSize(fullSize ?? false);
    ref.current?.expand();
  };

  const closeBottomSheet = () => {
    ref.current?.close();
    setContent(null);
  };

  // ---

  const ref = useRef<BottomSheet>(null);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    [],
  );

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}

      <BottomSheet
        ref={ref}
        enableDynamicSizing={!fullSize}
        enablePanDownToClose
        maxDynamicContentSize={fullSize ? undefined : height * 0.7}
        snapPoints={fullSize ? [height * 0.9] : undefined}
        index={-1}
        onClose={closeBottomSheet}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 60,
          }}
          style={{
            flex: 1,
          }}
        >
          {content}
        </BottomSheetScrollView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = (): BottomSheetContextData => useContext(BottomSheetContext);
