import {
  fromJS as _fromJS,
  List
} from 'immutable'

import moment from 'moment'

import {
  REPORTING_ONCALL_TEAM_GET,
  REPORTING_ONCALL_USER_GET,
  REPORTING_ONCALL_FILTER_UPDATE,
  REPORTING_ONCALL_TEAM_UPDATE,
  REPORTING_ONCALL_USER_UPDATE
} from 'reporting/actions/reporting'

export const initialState = _fromJS({
  loadingData: true,
  beginDate: moment().subtract(1, 'month').valueOf(),
  endDate: moment().valueOf(),
  selectedTeam: '',
  selectedUser: '',
  userData: {
    'team_name': null,
    'user_rollup': {
      'full_name': null,
      'total_hours_on_call': '0',
      'total_incidents_involved_with': 0,
      'username': null
    },
    'on_call': List(),
    'incidents': List()
  },
  teamData: {
    members: List()
  }
})

export default function onCallReport (state = initialState, action) {
  switch (action.type) {
    case REPORTING_ONCALL_TEAM_GET:
    case REPORTING_ONCALL_USER_GET:
      return _loadingData(state)
    case REPORTING_ONCALL_TEAM_UPDATE:
      return _updateTeamOnCall(state, action.payload)
    case REPORTING_ONCALL_FILTER_UPDATE:
      return _filterUpdate(state, action.payload)
    case REPORTING_ONCALL_USER_UPDATE:
      return _updateUserOnCall(state, action.payload)
    default : return state
  }
}

const _loadingData = (state) => state.update('loadingData', () => true)
const _filterUpdate = (state, payload) => state.merge(state, payload)

function _updateTeamOnCall (state, payload) {
  return state.set('teamData', _fromJS(payload.team))
              .update('loadingData', () => false)
}

function _updateUserOnCall (state, payload) {
  return state.set('userData', _fromJS(payload.user_data))
              .update('loadingData', () => false)
}
