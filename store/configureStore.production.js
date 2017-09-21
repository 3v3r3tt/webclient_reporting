import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers/index'
import { api } from 'components/__utils/xhr'
import createSagas from '../sagas'

const sagaMiddleware = createSagaMiddleware()

const finalCreateStore = compose(
  applyMiddleware(sagaMiddleware)
)(createStore)

export default function configureStore (initialData) {
  const voStore = finalCreateStore(
    rootReducer,
    initialData
  )

  sagaMiddleware.run(createSagas(api))

  return voStore
}
