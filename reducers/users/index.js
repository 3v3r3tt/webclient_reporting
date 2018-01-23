import { fromJS } from 'immutable'

import { USERS_UPDATE } from 'reporting/actions/users'

// Reducer
// ---------------------------------------------------------------------------

export const initialState = fromJS([])

export default function teamsReducer (state = initialState, action) {
  switch (action.type) {
    case USERS_UPDATE:
      return _updateUsers(action.payload)
    default :
      return state
  }
}

const _updateUsers = (payload) => {
  return fromJS(payload)
}
