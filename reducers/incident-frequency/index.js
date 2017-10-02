import {
  fromJS as _fromJS,
  List
} from 'immutable'

import moment from 'moment'

import {
  INCIDENT_FREQUENCY_TEAM_GET,
  INCIDENT_FREQUENCY_FILTER_UPDATE,
  INCIDENT_FREQUENCY_TEAM_UPDATE,
  INCIDENT_FREQUENCY_TEAM_ERROR
} from 'reporting/actions/incident-frequency'

export const initialState = _fromJS({
  loadingData: true,
  beginDate: moment().subtract(1, 'month').valueOf(),
  endDate: moment().valueOf(),
  selectedTeam: '',
  teamData: {
    members: List()
  },
  error: {
    list: false,
    detail: false
  }
})

export default function onCallReport (state = initialState, action) {
  switch (action.type) {
    case INCIDENT_FREQUENCY_TEAM_GET:
      return _loadingData(state)
    case INCIDENT_FREQUENCY_TEAM_UPDATE:
      return _updateTeamOnCall(state, action.payload)
    case INCIDENT_FREQUENCY_FILTER_UPDATE:
      return _filterUpdate(state, action.payload)
    case INCIDENT_FREQUENCY_TEAM_ERROR:
      return _setListErrorOnCall(state, action.payload)
    default : return state
  }
}

const _loadingData = (state) => state.update('loadingData', () => true)
const _filterUpdate = (state, payload) => state.merge(state, payload)

function _updateTeamOnCall (state, payload) {
  return state.set('teamData', _fromJS(payload.team))
              .update('loadingData', () => false)
              .setIn(['error', 'list'], false)
}

function _setListErrorOnCall (state, payload) {
  return state.setIn(['error', 'list'], _fromJS(payload.error))
}
