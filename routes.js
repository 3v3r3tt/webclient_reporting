import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import app from './containers/app'
import Reports from './containers/reports'
import IncidentFrequency from './containers/incident-frequency'
import { PostMortemEdit, PostMortemView } from './containers/post-mortem'
import PostMortems from './containers/post-mortems'
import mttaMttr from './containers/mtta-mttr'

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
      <Route path='mtta-mttr' component={mttaMttr} />
      <Route path='incident-frequency' component={IncidentFrequency} />
      <Route path='post-mortems' component={PostMortems} />
      <Route path='post-mortem/new' component={PostMortemEdit} />
      <Route path='post-mortem/:slug/edit' component={PostMortemEdit} />
      <Route path='post-mortem/:slug' component={PostMortemView} />
      <Redirect push path='*' to='/reports/:org' />
    </Route>
  )
}
