import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/user.slice";
import videoReducer from "./Slices/video.slice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { thunk } from "redux-thunk";

const persistConfig = {
    key: 'Root',
    storage
};

const persistedReducer = persistReducer(persistConfig, userReducer);
const persistedVideo = persistReducer(persistConfig, videoReducer)

export const store = configureStore({
    reducer: {
        user: persistedReducer,
        video: persistedVideo
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/REGISTER',
                    'persist/FLUSH',
                    'persist/PAUSE',
                    'persist/PURGE',
                ]
            }
        });
    }
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;