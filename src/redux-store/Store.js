import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// persistConfig
const persistConfig = {
    key: 'root',
    storage,
}

// initialState
const initialState = {};

// Use the initialState as a default value
function reducer(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
        case 'SAVE_REG_FORM_DATA':
            let regFormData = action?.payload?.regFormData;
            return {
                ...state,
                regFormData
            }

        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state
    }
}

// persistReducer
const persistedReducer = persistReducer(persistConfig, reducer)

// export store , persistor
let store = createStore(persistedReducer);
let persistor = persistStore(store);

export {
    store,
    persistor
}

