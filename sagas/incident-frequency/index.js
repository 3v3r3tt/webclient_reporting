import { takeEvery } from 'redux-saga'

import moment from 'moment'

import {
  put,
  call,
  select
} from 'redux-saga/effects'

import {
  INCIDENT_FREQUENCY_TABLE_GET,
  INCIDENT_FREQUENCY_GRAPH_GET,
  INCIDENT_FREQUENCY_INCIDENT_DETAIL_GET,
  incidentFrequencyGraphUpdate,
  incidentFrequencyGraphError,
  incidentFrequencyTableUpdate,
  incidentFrequencyTableError,
  incidentFrequencyIncidentDetailUpdate,
  incidentFrequencyIncidentDetailError
} from 'reporting/actions/incident-frequency'

import config from 'components/__utils/config'

export const _getincidentFrequencyState = (state) => state.incidentFrequency

function _getIncidentFrequencyTable ({create}, logError) {
  return function * (action) {
    try {
      const IncidentFrequencyReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencysegmentincidents`
      const reportingState = yield select(_getincidentFrequencyState)
      const data = {
        team: reportingState.get('selectedTeam', ''),
        start: moment(reportingState.getIn(['reducedData', 'reducedStart']) || reportingState.get('beginDate', '')).utc().startOf('day').valueOf(),
        end: moment(reportingState.getIn(['reducedData', 'reducedEnd']) || reportingState.get('endDate', '')).utc().startOf('day').valueOf() - 1,
        segment_name: action.payload.segmentName,
        segment_type: reportingState.getIn(['segmentationType', 'key']),
        tz_offset: reportingState.get('timezoneOffset')
      }
      const incidentFrequencyReportData = yield call(create, IncidentFrequencyReportEndpoint, data)
      yield put(incidentFrequencyTableUpdate(incidentFrequencyReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(incidentFrequencyTableError({error: {table: true}}))
    }
  }
}

function _getIncidentFrequencyGraph ({create}, logError) {
  return function * () {
    try {
      const IncidentFrequencyReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencygraph`
      const reportingState = yield select(_getincidentFrequencyState)
      const startDate = moment(reportingState.get('beginDate', '')).utc().startOf('day').valueOf()
      const endDate = moment(reportingState.get('endDate', '')).utc().endOf('day').valueOf()
      const data = {
        team: reportingState.get('selectedTeam', ''),
        start: startDate,
        end: endDate,
        tz_offset: reportingState.get('timezoneOffset', 0),
        bucket: reportingState.getIn(['resolutionType', 'type']),
        segment: reportingState.getIn(['segmentationType', 'key'])
      }

      const incidentFrequencyReportData = yield call(create, IncidentFrequencyReportEndpoint, data)
      yield put(incidentFrequencyGraphUpdate(incidentFrequencyReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(incidentFrequencyGraphError({error: {graph: true}}))
    }
  }
}

function _getIncidentFrequencyIncidentDetails ({fetch}, logError) {
  return function * (action) {
    try {
      const {
        incidentNumber,
        teamSlug,
        start,
        end
      } = action.payload
      const IncidentFrequencyIncidentDetailEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencymodal?incidentNumber=${incidentNumber}&teamSlug=${teamSlug}&start=${start}&end=${end}`

      const incidentFrequencyIncidentData = yield call(fetch, IncidentFrequencyIncidentDetailEndpoint)

      yield put(incidentFrequencyIncidentDetailUpdate(incidentFrequencyIncidentData))
    } catch (err) {
      yield call(logError, err)
      yield put(incidentFrequencyIncidentDetailError({error: {modal: true}}))
    }
  }
}

export const Test = {
  _getIncidentFrequencyTable,
  _getIncidentFrequencyGraph,
  _getIncidentFrequencyIncidentDetails,
  _getincidentFrequencyState
}

export function * watchGetIncidentFrequencyTable (api, logError) {
  yield * takeEvery(INCIDENT_FREQUENCY_TABLE_GET, _getIncidentFrequencyTable(api, logError))
}

export function * watchGetIncidentFrequencyGraph (api, logError) {
  yield * takeEvery(INCIDENT_FREQUENCY_GRAPH_GET, _getIncidentFrequencyGraph(api, logError))
}

export function * watchGetIncidentFrequencyIncidentDetails (api, logError) {
  yield * takeEvery(INCIDENT_FREQUENCY_INCIDENT_DETAIL_GET, _getIncidentFrequencyIncidentDetails(api, logError))
}
