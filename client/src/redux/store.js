import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './userRedux'
import postReducer from './postRedux'
import commentReducer from './commentRedux'
import conversationReducer from './conversationRedux'

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};
const rootReducer = combineReducers({ user: userReducer, post: postReducer, comment: commentReducer, conversation: conversationReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export let persistor = persistStore(store);