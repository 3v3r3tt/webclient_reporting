import { fromJS as _fromJS } from 'immutable'

import moment from 'moment'

import {
  INCIDENT_FREQUENCY_GRAPH_GET,
  INCIDENT_FREQUENCY_GRAPH_UPDATE,
  INCIDENT_FREQUENCY_GRAPH_ERROR,
  INCIDENT_FREQUENCY_TABLE_GET,
  INCIDENT_FREQUENCY_TABLE_UPDATE,
  INCIDENT_FREQUENCY_INNER_TABLE_RESET,
  INCIDENT_FREQUENCY_TABLE_ERROR,
  INCIDENT_FREQUENCY_FILTER_UPDATE,
  INCIDENT_FREQUENCY_TABLE_REDUCE,
  INCIDENT_FREQUENCY_TABLE_RESET,
  INCIDENT_FREQUENCY_INCIDENT_DETAIL_GET,
  INCIDENT_FREQUENCY_INCIDENT_DETAIL_UPDATE,
  INCIDENT_FREQUENCY_INCIDENT_DETAIL_ERROR
} from 'reporting/actions/incident-frequency'

export const initialState = _fromJS({
  loadingData: true,
  beginDate: moment().subtract(1, 'month').valueOf(),
  endDate: moment().valueOf(),
  timezoneOffset: moment().utcOffset() / 60,
  selectedTeam: '',
  chartType: 'Area',
  segmentationType: {
    name: 'Segment by service',
    key: 'service'
  },
  resolutionType: {
    name: 'Display weekly',
    type: 'week'
  },
  graphData: null,
  innerTableIncidentData: null,
  incidentDetailData: null,
  error: {
    graph: false,
    table: false
  },
  reducedData: {
    reducedRows: null,
    animation: true,
    columnTitle: null,
    selectedBucket: null
  }
})

export default function incidentFrequencyReport (state = initialState, action) {
  switch (action.type) {
    case INCIDENT_FREQUENCY_TABLE_GET:
    case INCIDENT_FREQUENCY_GRAPH_GET:
    case INCIDENT_FREQUENCY_INCIDENT_DETAIL_GET:
      return _loadingData(state)
    case INCIDENT_FREQUENCY_GRAPH_UPDATE:
      return _updateGraph(state, action.payload)
    case INCIDENT_FREQUENCY_TABLE_UPDATE:
      return _updateTable(state, action.payload)
    case INCIDENT_FREQUENCY_INNER_TABLE_RESET:
      return _resetInnerTable(state, action.payload)
    case INCIDENT_FREQUENCY_FILTER_UPDATE:
      return _filterUpdate(state, action.payload)
    case INCIDENT_FREQUENCY_GRAPH_ERROR:
      return _setIncidentFrequencyGraphError(state, action.payload)
    case INCIDENT_FREQUENCY_TABLE_ERROR:
      return _setIncidentFrequencyTableError(state, action.payload)
    case INCIDENT_FREQUENCY_TABLE_REDUCE:
      return _updateReducedTable(state, action.payload)
    case INCIDENT_FREQUENCY_TABLE_RESET:
      return _resetReducedTable(state, action.payload)
    case INCIDENT_FREQUENCY_INCIDENT_DETAIL_UPDATE:
      return _updateIncidentDetail(state, action.payload)
    case INCIDENT_FREQUENCY_INCIDENT_DETAIL_ERROR:
      return _setIncidentFrequencyIncidentDetailError(state, action.payload)
    default : return state
  }
}

const _loadingData = (state) => state.update('loadingData', () => true)

function _filterUpdate (state, payload) {
  const filterKey = Object.keys(payload)[0]
  return state.set(filterKey, payload[filterKey])
}

function _updateTable (state, payload) {
  return state.set('innerTableIncidentData', _fromJS(payload))
              .update('loadingData', () => false)
              .setIn(['error', 'table'], false)
}

function _resetInnerTable (state, payload) {
  return state.set('innerTableIncidentData', null)
              .update('loadingData', () => false)
              .setIn(['error', 'table'], false)
}

function _setIncidentFrequencyTableError (state, payload) {
  return state.setIn(['error', 'table'], _fromJS(payload.error))
}

function _setIncidentFrequencyGraphError (state, payload) {
  return state.setIn(['error', 'graph'], _fromJS(payload.error))
}

function _updateReducedTable (state, payload) {
  return state.set('reducedData', _fromJS(payload))
}

function _resetReducedTable (state, payload) {
  return state.set('reducedData', _fromJS({
    reducedRows: null,
    animation: true,
    columnTitle: null,
    selectedBucket: null}))
}

function _setIncidentFrequencyIncidentDetailError (state, payload) {
  return state.setIn(['error', 'modal'], _fromJS(payload.error))
}

function _updateIncidentDetail (state, payload) {
  return state.set('incidentDetailData', _fromJS(payload))
}

function _updateGraph (state, payload) {
  return state.set('graphData', _fromJS(payload))
              .update('loadingData', () => false)
              .setIn(['error', 'graph'], false)
}
