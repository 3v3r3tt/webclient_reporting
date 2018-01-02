import { fromJS as _fromJS } from 'immutable'

import moment from 'moment'

import {
  MTTA_MTTR_GRAPH_GET,
  MTTA_MTTR_GRAPH_UPDATE,
  MTTA_MTTR_GRAPH_ERROR,
  MTTA_MTTR_FILTER_UPDATE,
  MTTA_MTTR_ROUTE_KEY_UPDATE
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
  selectedRouteKeys: [],
  error: {
    graph: false
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
    case MTTA_MTTR_ROUTE_KEY_UPDATE:
      return _updateSelectedRouteKeys(state, action.payload)

    default : return state
  }
}

const _loadingGraphData = (state) => state.update('loadingGraphData', () => true)

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

function _updateSelectedRouteKeys (state, payload) {
  return state.set('selectedRouteKeys', _fromJS(payload))
}
