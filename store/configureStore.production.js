import { createStore, applyMiddleware, compose } from 'redux'
import { autoRehydrate, persistStore } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers/index'
import { api } from 'components/__utils/xhr'
import createSagas from '../sagas'

const { VO_CONFIG } = window

const sagaMiddleware = createSagaMiddleware()

const finalCreateStore = compose(
  applyMiddleware(sagaMiddleware),
  autoRehydrate()
)(createStore)

export default function configureStore (initialData) {
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
