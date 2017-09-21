import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers/index'

const sagaMiddleware = createSagaMiddleware()

const finalCreateStore = compose(
  applyMiddleware(sagaMiddleware)
)(createStore)

export default function configureStore (initialState) {
  return finalCreateStore(rootReducer, initialState)
}
