// vendor
// ---------------------------------------------------------------------------
import createSagaMiddleware from 'redux-saga'

import {
    autoRehydrate,
    persistStore
} from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'

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

const { VO_CONFIG } = window

const sagaMiddleware = createSagaMiddleware()

const finalCreateStore = compose(
    applyMiddleware(sagaMiddleware),
    autoRehydrate(),
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

  persistStore(voStore, {
    whitelist: ['reportingOnCall', 'incidentFrequency'],
    transforms: [immutableTransform()],
    keyPrefix: VO_CONFIG.orgslug + ':'
  })

  return voStore
}
