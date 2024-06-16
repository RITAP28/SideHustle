import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/user.slice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { thunk } from "redux-thunk";

const persistConfig = {
    key: 'Root',
    storage
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        user: persistedReducer
    },
    // middleware: [thunk]
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;