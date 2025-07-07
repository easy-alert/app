import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";

// Add type for console.tron
declare global {
  interface Console {
    tron?: typeof Reactotron;
  }
}

if (__DEV__) {
  Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({ name: "Easy Alert App" })
    .useReactNative({
      asyncStorage: true,
      editor: false,
      errors: { veto: (stackFrame) => false },
      overlay: false,
    })
    .connect();

  console.tron = Reactotron;
}
