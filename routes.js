import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import app from './containers/app'
import Reports from './containers/reports'

import {
  ReportsOnCallList,
  ReportsOnCallDetail
} from './containers/reports-on-call'

export function getRoutes () {
  return (
    <Route path='/reports/:org' component={app} >
      <IndexRoute component={Reports} />
      <Route name='page' path='on-call' component={ReportsOnCallList} />
      <Route path='on-call/:slug' component={ReportsOnCallDetail} />
      <Redirect push path='*' to='/dash/:org#reports' />
    </Route>
  )
}
