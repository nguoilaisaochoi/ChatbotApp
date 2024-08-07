import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../Reducer/UserReducer";
import ChatReducer from "../Reducer/ChatReducer";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedUserReducer = persistReducer(persistConfig, UserReducer);
const rootReducer = {
  user: persistedUserReducer,
  chat: ChatReducer,
};
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // tắt kiểm tra tuần tự hóa
    }),
});
export const persistor = persistStore(store);
