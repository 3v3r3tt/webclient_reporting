import { fromJS as _fromJS } from 'immutable'

import moment from 'moment'

import {
  MTTA_MTTR_GRAPH_GET,
  MTTA_MTTR_GRAPH_UPDATE,
  MTTA_MTTR_GRAPH_ERROR,
  MTTA_MTTR_TABLE_GET,
  MTTA_MTTR_TABLE_UPDATE,
  MTTA_MTTR_INNER_TABLE_RESET,
  MTTA_MTTR_TABLE_ERROR,
  MTTA_MTTR_FILTER_UPDATE,
  MTTA_MTTR_TABLE_REDUCE,
  MTTA_MTTR_TABLE_RESET,
  MTTA_MTTR_INCIDENT_DETAIL_GET,
  MTTA_MTTR_INCIDENT_DETAIL_UPDATE,
  MTTA_MTTR_INCIDENT_DETAIL_ERROR
} from 'reporting/actions/mtta-mttr'

export const initialState = _fromJS({
  loadingGraphData: true,
  loadingTableData: true,
  beginDate: moment().subtract(1, 'month').valueOf(),
  endDate: moment().valueOf(),
  timezoneOffset: moment().utcOffset() / 60,
  selectedTeam: '',
  chartType: 'Area',
  segmentationType: {
    name: 'Segment by integration',
    label: 'Integration',
    key: 'monitor'
  },
  resolutionType: {
    name: 'Display weekly',
    type: 'week'
  },
  graphData: {
    display_buckets: []
  },
  innerTableIncidentData: {
    segments: [],
    incidents: []
  },
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

export default function mttaMttrReport (state = initialState, action) {
  switch (action.type) {
    case MTTA_MTTR_TABLE_GET:
    case MTTA_MTTR_INCIDENT_DETAIL_GET:
      return _loadingTableData(state)
    case MTTA_MTTR_GRAPH_GET:
      return _loadingGraphData(state)
    case MTTA_MTTR_GRAPH_UPDATE:
      return _updateGraph(state, action.payload)
    case MTTA_MTTR_TABLE_UPDATE:
      return _updateTable(state, action.payload)
    case MTTA_MTTR_INNER_TABLE_RESET:
      return _resetInnerTable(state, action.payload)
    case MTTA_MTTR_FILTER_UPDATE:
      return _filterUpdate(state, action.payload)
    case MTTA_MTTR_GRAPH_ERROR:
      return _setmttaMttrGraphError(state, action.payload)
    case MTTA_MTTR_TABLE_ERROR:
      return _setmttaMttrTableError(state, action.payload)
    case MTTA_MTTR_TABLE_REDUCE:
      return _updateReducedTable(state, action.payload)
    case MTTA_MTTR_TABLE_RESET:
      return _resetReducedTable(state, action.payload)
    case MTTA_MTTR_INCIDENT_DETAIL_UPDATE:
      return _updateIncidentDetail(state, action.payload)
    case MTTA_MTTR_INCIDENT_DETAIL_ERROR:
      return _setmttaMttrIncidentDetailError(state, action.payload)
    default : return state
  }
}

const _loadingGraphData = (state) => state.update('loadingGraphData', () => true)
const _loadingTableData = (state) => state.update('loadingTableData', () => true)

function _filterUpdate (state, payload) {
  const filterKey = Object.keys(payload)[0]
  return state.set(filterKey, payload[filterKey])
              .set('reducedData', initialState.get('reducedData'))
              .update('loadingTableData', () => true)
              .set('innerTableIncidentData', null)
}

function _updateTable (state, payload) {
  return state.set('innerTableIncidentData', _fromJS(payload))
              .update('loadingTableData', () => false)
              .setIn(['error', 'table'], false)
}

function _resetInnerTable (state, payload) {
  return state.set('innerTableIncidentData', null)
              .update('loadingTableData', () => false)
              .setIn(['error', 'table'], false)
}

function _setmttaMttrTableError (state, payload) {
  return state.setIn(['error', 'table'], _fromJS(payload.error))
}

function _setmttaMttrGraphError (state, payload) {
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

function _setmttaMttrIncidentDetailError (state, payload) {
  return state.setIn(['error', 'modal'], _fromJS(payload.error))
}

function _updateIncidentDetail (state, payload) {
  return state.set('incidentDetailData', _fromJS(payload))
}

function _updateGraph (state, payload) {
  return state.set('graphData', _fromJS(payload))
              .update('loadingGraphData', () => false)
              .setIn(['error', 'graph'], false)
}
