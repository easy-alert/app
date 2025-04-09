import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from "@gorhom/bottom-sheet";
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";

interface BottomSheetContextData {
  openBottomSheet: (content: ReactNode) => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext({} as BottomSheetContextData);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode | null>(null);

  const { height } = useWindowDimensions();

  const openBottomSheet = (content: ReactNode) => {
    setContent(content);
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
        enableDynamicSizing
        enablePanDownToClose
        maxDynamicContentSize={height * 0.7}
        index={-1}
        onClose={closeBottomSheet}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 60,
          }}
        >
          {content}
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = (): BottomSheetContextData => useContext(BottomSheetContext);
