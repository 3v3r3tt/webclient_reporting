import { takeEvery } from 'redux-saga'

import moment from 'moment'
import meta from 'util/meta'

import {
  put,
  call,
  select
} from 'redux-saga/effects'

import {
  MTTA_MTTR_GRAPH_GET,
  MTTA_MTTR_TABLE_GET,
  MTTA_MTTR_GOAL_MTTA_SET,
  MTTA_MTTR_GOAL_MTTR_SET,
  mttaMttrGraphUpdate,
  mttaMttrGraphError,
  mttaMttrTableUpdate,
  mttaMttrTableError,
  mttaMttrGoalUpdateMtta,
  mttaMttrGoalUpdateMttr
} from 'reporting/actions/mtta-mttr'

import config from 'components/__utils/config'

export const _getMttaMttrState = (state) => state.mttaMttr

function _getMttaMttrGraph ({create}, logError) {
  return function * () {
    try {
      const mttaMttrReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/performancegraph`
      const mttaMttrState = yield select(_getMttaMttrState)
      const startDate = moment(mttaMttrState.get('beginDate', '')).utc().startOf('day').valueOf()
      const endDate = moment(mttaMttrState.get('endDate', '')).utc().endOf('day').valueOf()
      const data = {
        team: mttaMttrState.get('selectedTeam', ''),
        route_key: mttaMttrState.get('selectedRouteKeys', []),
        time_period: mttaMttrState.getIn(['resolutionType', 'type']),
        start: startDate,
        end: endDate,
        tz_offset: mttaMttrState.get('timezoneOffset', 0)
      }

      const mttaMttrReportData = yield call(create, mttaMttrReportEndpoint, data)
      yield put(mttaMttrGraphUpdate(mttaMttrReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(mttaMttrGraphError({error: {graph: true}}))
    }
  }
}

// TODO: Remove lint disable when API works
/* eslint-disable */
function _getMttaMttrTable ({create}, logError) {
  return function * () {
    try {
      const mttaMttrReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/performancetable`
      const mttaMttrState = yield select(_getMttaMttrState)
      const startDate = moment(mttaMttrState.get('beginDate', '')).utc().startOf('day').valueOf()
      const endDate = moment(mttaMttrState.get('endDate', '')).utc().endOf('day').valueOf()
      const data = {
        team: mttaMttrState.get('selectedTeam', ''),
        route_key: mttaMttrState.get('selectedRouteKeys', []),
        time_period: mttaMttrState.getIn(['resolutionType', 'type']),
        start: startDate,
        end: endDate,
        tz_offset: mttaMttrState.get('timezoneOffset', 0)
      }

      const mttaMttrReportData = yield call(create, mttaMttrReportEndpoint, data)
      yield put(mttaMttrTableUpdate(mttaMttrReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(mttaMttrTableError({error: {table: true}}))
    }
  }
}

function _setMttaMttrGoalMtta (api, logError) {
  return function * (action) {
    try {
      yield put(mttaMttrGoalUpdateMtta(action.payload))
      yield call(meta.putUserMeta, {'mmr:goal:mtta': action.payload.mtta})
    } catch (err) {
      yield call(logError, err)
    }
  }
}

function _setMttaMttrGoalMttr (api, logError) {
  return function * (action) {
    try {
      yield put(mttaMttrGoalUpdateMttr(action.payload))
      yield call(meta.putUserMeta, {'mmr:goal:mttr': action.payload.mttr})
    } catch (err) {
      yield call(logError, err)
    }
  }
}

function _setMttaMttrGoalMtta (api, logError) {
  return function * (action) {
    try {
      yield put(mttaMttrGoalUpdateMtta(action.payload))
      yield call(meta.putUserMeta, {'mmr:goal:mtta': action.payload.mtta})
    } catch (err) {
      yield call(logError, err)
    }
  }
}

function _setMttaMttrGoalMttr (api, logError) {
  return function * (action) {
    try {
      yield put(mttaMttrGoalUpdateMttr(action.payload))
      yield call(meta.putUserMeta, {'mmr:goal:mttr': action.payload.mttr})
    } catch (err) {
      yield call(logError, err)
    }
  }
}

export const Test = {
  _getMttaMttrGraph,
  _getMttaMttrTable,
  _setMttaMttrGoalMtta,
  _setMttaMttrGoalMttr,
  _getMttaMttrState
}

export function * watchGetMttaMttrGraph (api, logError) {
  yield * takeEvery(MTTA_MTTR_GRAPH_GET, _getMttaMttrGraph(api, logError))
}

export function * watchGetMttaMttrTable (api, logError) {
  yield * takeEvery(MTTA_MTTR_TABLE_GET, _getMttaMttrTable(api, logError))
}

export function * watchSetMttaMttrGoalMtta (api, logError) {
  yield * takeEvery(MTTA_MTTR_GOAL_MTTA_SET, _setMttaMttrGoalMtta(api, logError))
}

export function * watchSetMttaMttrGoalMttr (api, logError) {
  yield * takeEvery(MTTA_MTTR_GOAL_MTTR_SET, _setMttaMttrGoalMttr(api, logError))
}
