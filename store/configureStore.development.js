// vendor
// ---------------------------------------------------------------------------
import createSagaMiddleware from 'redux-saga'

import {
    autoRehydrate
} from 'redux-persist'

import {
    applyMiddleware,
    createStore,
    compose
} from 'redux'

// lib
// ---------------------------------------------------------------------------

import createSagas from '../sagas'
import rootReducer from '../reducers'
import { api } from 'components/__utils/xhr'

// ---------------------------------------------------------------------------

const sagaMiddleware = createSagaMiddleware()

const finalCreateStore = compose(
    autoRehydrate(),
    applyMiddleware(sagaMiddleware),
    global && global.devToolsExtension ? global.devToolsExtension() : f => f
)(createStore)

// Store
// ---------------------------------------------------------------------------

export default function store (initialData) {
  const voStore = finalCreateStore(
    rootReducer,
    initialData
  )

  sagaMiddleware.run(createSagas(api))

  return voStore
}
