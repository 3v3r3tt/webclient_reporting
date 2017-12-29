import { takeEvery } from 'redux-saga'

import moment from 'moment'

import {
  put,
  call,
  select
} from 'redux-saga/effects'

import {
  MTTA_MTTR_GRAPH_GET,
  mttaMttrGraphUpdate,
  mttaMttrGraphError
} from 'reporting/actions/mtta-mttr'

import mttaMttrGraphData from './sampleData/mttaMttrGraphData'

import config from 'components/__utils/config'

export const _getMttaMttrState = (state) => state.mttaMttr

// TODO: Remove lint disable when API works
/* eslint-disable */
function _getMttaMttrGraph ({create}, logError) {
  return function * () {
    try {
      const mttaMttrReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/performancereportgraph`
      const mttaMttrState = yield select(_getMttaMttrState)
      const startDate = moment(mttaMttrState.get('beginDate', '')).utc().startOf('day').valueOf()
      const endDate = moment(mttaMttrState.get('endDate', '')).utc().endOf('day').valueOf()
      const data = {
        team: mttaMttrState.get('selectedTeam', ''),
        route_key: mttaMttrState.get('routeKey', []),
        time_period: mttaMttrState.getIn(['resolutionType', 'type']),
        start: startDate,
        end: endDate,
        tz_offset: mttaMttrState.get('timezoneOffset', 0)
      }

      // TODO: uncomment below when API is ready to go
      // const mttaMttrReportData = yield call(create, mttaMttrReportEndpoint, data)
      const mttaMttrReportData = mttaMttrGraphData
      yield put(mttaMttrGraphUpdate(mttaMttrReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(mttaMttrGraphError({error: {graph: true}}))
    }
  }
}
/* eslint-enable */

export const Test = {
  _getMttaMttrGraph,
  _getMttaMttrState
}

export function * watchGetMttaMttrGraph (api, logError) {
  yield * takeEvery(MTTA_MTTR_GRAPH_GET, _getMttaMttrGraph(api, logError))
}
