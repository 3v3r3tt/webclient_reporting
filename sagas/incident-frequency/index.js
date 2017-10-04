import { takeEvery } from 'redux-saga'

import {
  put,
  call,
  select
} from 'redux-saga/effects'

import {
  INCIDENT_FREQUENCY_TABLE_GET,
  INCIDENT_FREQUENCY_GRAPH_GET,
  incidentFrequencyGraphUpdate,
  incidentFrequencyGraphError,
  incidentFrequencyTableUpdate,
  incidentFrequencyTableError
} from 'reporting/actions/incident-frequency'

import config from 'components/__utils/config'

export const _getincidentFrequencyState = (state) => state.incidentFrequency

function _getIncidentFrequencyTable ({create}, logError) {
  return function * () {
    try {
      let IncidentFrequencyReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfreqtable`
      let reportingState = yield select(_getincidentFrequencyState)
      const data = {
        team: reportingState.get('selectedTeam', ''),
        begin: reportingState.get('beginDate', ''),
        end: reportingState.get('endDate', '')
      }

      const IncidentFrequencyReportData = yield call(create, IncidentFrequencyReportEndpoint, data)
      yield put(incidentFrequencyTableUpdate(IncidentFrequencyReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(incidentFrequencyTableError({error: {list: true}}))
    }
  }
}

function _getIncidentFrequencyGraph ({create}, logError) {
  return function * () {
    try {
      let IncidentFrequencyReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfreqgraph`
      let reportingState = yield select(_getincidentFrequencyState)
      const data = {
        team: reportingState.get('selectedTeam', ''),
        begin: reportingState.get('beginDate', ''),
        end: reportingState.get('endDate', '')
      }

      const IncidentFrequencyReportData = yield call(create, IncidentFrequencyReportEndpoint, data)
      yield put(incidentFrequencyGraphUpdate(IncidentFrequencyReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(incidentFrequencyGraphError({error: {list: true}}))
    }
  }
}

export const Test = {
  _getIncidentFrequencyTable,
  _getincidentFrequencyState
}

export function * watchGetIncidentFrequencyTable (api, logError) {
  yield * takeEvery(INCIDENT_FREQUENCY_TABLE_GET, _getIncidentFrequencyTable(api, logError))
}
export function * watchGetIncidentFrequencyGraph (api, logError) {
  yield * takeEvery(INCIDENT_FREQUENCY_GRAPH_GET, _getIncidentFrequencyGraph(api, logError))
}
