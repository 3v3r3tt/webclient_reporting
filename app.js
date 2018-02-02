// vendor
import React from 'react'
import { fromJS } from 'immutable'
import { Provider } from 'react-redux'
import { getRoutes } from './routes'
import initRaygun from 'util/initRaygun'
import configureStore from './store/configureStore'

import {
  render
} from 'react-dom'

import {
  Router,
  browserHistory
} from 'react-router'

import { hideModal } from 'reporting/actions/modal'

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

initRaygun()

async function onUpdate () {
  store.dispatch(hideModal())
}

export default function () {
  render(
    <Provider store={store}>
      <Router
        history={browserHistory}
        onUpdate={onUpdate}
      >
        { getRoutes() }
      </Router>
    </Provider>,
    document.getElementById('reporting')
  )
}
