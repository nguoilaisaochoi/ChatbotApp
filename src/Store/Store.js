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
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
      },
    }),
});
export const persistor = persistStore(store);
