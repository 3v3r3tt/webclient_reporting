// vendor
import React from 'react'
import { fromJS } from 'immutable'
import { Provider } from 'react-redux'
import { getRoutes } from './routes'
import configureStore from './store/configureStore'

import {
  render
} from 'react-dom'

import {
  Router,
  browserHistory
} from 'react-router'

const {
  VO_CONFIG,
  VO_ENV,
  VO_ROUTES
} = window

const store = configureStore({
  auth: {
    config: fromJS(VO_CONFIG),
    env: fromJS(VO_ENV),
    routes: fromJS(VO_ROUTES)
  }
})

export default function () {
  render(
    <Provider store={store}>
      <Router history={browserHistory}>
        { getRoutes() }
      </Router>
    </Provider>,
    document.getElementById('reporting')
  )
}
