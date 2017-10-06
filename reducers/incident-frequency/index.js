import {
  fromJS as _fromJS,
  List
} from 'immutable'

import moment from 'moment'
import data from './data'

import {
  INCIDENT_FREQUENCY_GRAPH_GET,
  INCIDENT_FREQUENCY_GRAPH_UPDATE,
  INCIDENT_FREQUENCY_GRAPH_ERROR,
  INCIDENT_FREQUENCY_TABLE_GET,
  INCIDENT_FREQUENCY_TABLE_UPDATE,
  INCIDENT_FREQUENCY_TABLE_ERROR,
  INCIDENT_FREQUENCY_FILTER_UPDATE
} from 'reporting/actions/incident-frequency'

export const initialState = _fromJS({
  loadingData: true,
  beginDate: moment().subtract(1, 'month').valueOf(),
  endDate: moment().valueOf(),
  selectedTeam: '',
  tableData: List(),
  graphData: data,
  error: {
    list: false,
    detail: false
  }
})

export default function onCallReport (state = initialState, action) {
  switch (action.type) {
    case INCIDENT_FREQUENCY_TABLE_GET:
    case INCIDENT_FREQUENCY_GRAPH_GET:
      return _loadingData(state)
    case INCIDENT_FREQUENCY_TABLE_UPDATE:
    case INCIDENT_FREQUENCY_GRAPH_UPDATE:
      return _updateTable(state, action.payload)
    case INCIDENT_FREQUENCY_FILTER_UPDATE:
      return _filterUpdate(state, action.payload)
    case INCIDENT_FREQUENCY_TABLE_ERROR:
    case INCIDENT_FREQUENCY_GRAPH_ERROR:
      return _setListErrorOnCall(state, action.payload)
    default : return state
  }
}

const _loadingData = (state) => state.update('loadingData', () => true)
const _filterUpdate = (state, payload) => state.merge(state, payload)

function _updateTable (state, payload) {
  return state.set('tableData', _fromJS(payload.data))
              .update('loadingData', () => false)
              .setIn(['error', 'list'], false)
}

function _setListErrorOnCall (state, payload) {
  return state.setIn(['error', 'list'], _fromJS(payload.error))
}
