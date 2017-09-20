// vendor
import {
    fromJS
} from 'immutable'

import {
    TEAMS_UPDATE
} from 'reporting/actions/teams'

// Reducer
// ---------------------------------------------------------------------------

export const initialState = fromJS([])

export default function teamsReducer (state = initialState, action) {
  switch (action.type) {
    case TEAMS_UPDATE : return fromJS(action.payload)
    default : return state
  }
}
