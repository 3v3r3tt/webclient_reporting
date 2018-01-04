import { fromJS as _fromJS } from 'immutable'

import moment from 'moment'

import {
  MTTA_MTTR_GRAPH_GET,
  MTTA_MTTR_GRAPH_UPDATE,
  MTTA_MTTR_GRAPH_ERROR,
  MTTA_MTTR_TABLE_GET,
  MTTA_MTTR_TABLE_UPDATE,
  MTTA_MTTR_TABLE_ERROR,
  MTTA_MTTR_FILTER_UPDATE,
  MTTA_MTTR_ROUTE_KEY_UPDATE,
  MTTA_MTTR_GOAL_MTTA_SET,
  MTTA_MTTR_GOAL_MTTR_SET
} from 'reporting/actions/mtta-mttr'

export const initialState = _fromJS({
  loadingGraphData: true,
  beginDate: moment().subtract(1, 'month').valueOf(),
  endDate: moment().valueOf(),
  timezoneOffset: moment().utcOffset() / 60,
  selectedTeam: '',
  resolutionType: {
    name: 'Display weekly',
    type: 'week'
  },
  graphData: {},
  table: {
    loading: true,
    data: []
  },
  selectedRouteKeys: [],
  goals: {
    mtta: null,
    mttr: null
  },
  error: {
    graph: false,
    table: false
  }
})

export default function mttaMttrReport (state = initialState, action) {
  switch (action.type) {
    case MTTA_MTTR_FILTER_UPDATE:
      return _filterUpdate(state, action.payload)
    case MTTA_MTTR_GRAPH_GET:
      return _loadingGraphData(state)
    case MTTA_MTTR_GRAPH_UPDATE:
      return _updateGraph(state, action.payload)
    case MTTA_MTTR_GRAPH_ERROR:
      return _setmttaMttrGraphError(state, action.payload)
    case MTTA_MTTR_TABLE_GET:
      return _loadingTableData(state)
    case MTTA_MTTR_TABLE_UPDATE:
      return _updateTable(state, action.payload)
    case MTTA_MTTR_TABLE_ERROR:
      return _setmttaMttrTableError(state, action.payload)
    case MTTA_MTTR_ROUTE_KEY_UPDATE:
      return _updateSelectedRouteKeys(state, action.payload)
    case MTTA_MTTR_GOAL_MTTA_SET:
      return _setMttaGoal(state, action.payload)
    case MTTA_MTTR_GOAL_MTTR_SET:
      return _setMttrGoal(state, action.payload)

    default : return state
  }
}

const _loadingGraphData = (state) => state.update('loadingGraphData', () => true)
const _loadingTableData = (state) => state.updateIn(['table', 'loading'], () => true)

function _filterUpdate (state, payload) {
  const filterKey = Object.keys(payload)[0]
  return state.set(filterKey, payload[filterKey])
              .update('loadingTableData', () => true)
}

function _setmttaMttrGraphError (state, payload) {
  return state.setIn(['error', 'graph'], _fromJS(payload.error))
}

function _updateGraph (state, payload) {
  return state.set('graphData', _fromJS(payload))
              .update('loadingGraphData', () => false)
              .setIn(['error', 'graph'], false)
}

function _setmttaMttrTableError (state, payload) {
  return state.setIn(['error', 'table'], _fromJS(payload.error))
}

function _updateTable (state, payload) {
  return state.setIn(['table', 'data'], _fromJS(payload))
              .updateIn(['table', 'loading'], () => false)
              .setIn(['error', 'table'], false)
}

function _updateSelectedRouteKeys (state, payload) {
  return state.set('selectedRouteKeys', _fromJS(payload))
}

function _setMttaGoal (state, payload) {
  return state.setIn(['goals', 'mtta'], _fromJS(payload.mtta))
}

function _setMttrGoal (state, payload) {
  return state.setIn(['goals', 'mttr'], _fromJS(payload.mttr))
}
