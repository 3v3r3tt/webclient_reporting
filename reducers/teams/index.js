import { fromJS } from 'immutable'

import { TEAMS_UPDATE } from 'reporting/actions/teams'

// Reducer
// ---------------------------------------------------------------------------

export const initialState = fromJS([])

export default function teamsReducer (state = initialState, action) {
  switch (action.type) {
    case TEAMS_UPDATE :
      return _updateTeams(action.payload)
    default :
      return state
  }
}

const _updateTeams = (payload) => {
  const sortFn = (x, y) => x.name.localeCompare(y.name)
  return fromJS(payload.sort(sortFn))
}
