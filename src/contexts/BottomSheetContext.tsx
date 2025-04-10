import BottomSheetComponent from "@gorhom/bottom-sheet";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

import { BottomSheet } from "@/components/BottomSheet";

interface OpenBottomSheetProps {
  content: ReactNode;
  footer?: ReactNode;
  fullSize?: boolean;
}

interface BottomSheetContextData {
  openBottomSheet: (props: OpenBottomSheetProps) => void;
  closeBottomSheet: () => void;
}

const BottomSheetContext = createContext({} as BottomSheetContextData);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [footer, setFooter] = useState<ReactNode | null>(null);
  const [fullSize, setFullSize] = useState(false);

  const ref = useRef<BottomSheetComponent>(null);

  const openBottomSheet = ({ content, footer = null, fullSize = false }: OpenBottomSheetProps) => {
    setContent(content);
    setFooter(footer);
    setFullSize(fullSize);
    ref.current?.expand();
  };

  const closeBottomSheet = () => {
    ref.current?.close();
    setContent(null);
    setFooter(null);
    setFullSize(false);
  };

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}

      <BottomSheet ref={ref} content={content} fullSize={fullSize} footer={footer} onClose={closeBottomSheet} />
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = (): BottomSheetContextData => useContext(BottomSheetContext);
