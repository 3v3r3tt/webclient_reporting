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

// TODO: remove this once API working
/*eslint-disable */
import mockGraphData from './sampleData/graphData'
import mockTableData from './sampleData/tableData'

export const _getincidentFrequencyState = (state) => state.incidentFrequency

function _getIncidentFrequencyTable ({create}, logError) {
  return function * () {
    try {
      const IncidentFrequencyReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencysegmentincidents`
      const reportingState = yield select(_getincidentFrequencyState)
      const data = {
        team: reportingState.get('selectedTeam', ''),
        start_time: reportingState.get('beginDate', ''),
        end_time: reportingState.get('endDate', ''),
        segment_name: reportingState.get('selectedSegment'),
        segment_type: reportingState.get('selectedSegmentType'),
        tz_offset: reportingState.get('tz_offset')
      }

      // const incidentFrequencyReportData = yield call(create, IncidentFrequencyReportEndpoint, data)
      // TODO: remove this once API works
      const incidentFrequencyReportData = mockTableData
      yield put(incidentFrequencyTableUpdate(incidentFrequencyReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(incidentFrequencyTableError({error: {list: true}}))
    }
  }
}

function _getIncidentFrequencyGraph ({create}, logError) {
  return function * () {
    try {
      const IncidentFrequencyReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencygraph`
      const reportingState = yield select(_getincidentFrequencyState)
      const data = {
        team: reportingState.get('selectedTeam', ''),
        start_time: reportingState.get('beginDate', ''),
        end_time: reportingState.get('endDate', ''),
        display_by: reportingState.get('display_by'),
        segment_type: reportingState.get('selectedSegmentType'),
        tz_offset: reportingState.get('tz_offset')
      }

      // const IncidentFrequencyReportData = yield call(create, IncidentFrequencyReportEndpoint, data)
      // TODO: remove this once API works
      const incidentFrequencyReportData = mockGraphData

      yield put(incidentFrequencyGraphUpdate(incidentFrequencyReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(incidentFrequencyGraphError({error: {list: true}}))
    }
  }
}

// TODO: remove this once API works
/*eslint-enable */

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
