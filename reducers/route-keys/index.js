import { fromJS } from 'immutable'

import { ROUTE_KEYS_UPDATE } from 'reporting/actions/route-keys'

// Reducer
// ---------------------------------------------------------------------------

export const initialState = fromJS([])

export default function routeKeysReducer (state = initialState, action) {
  switch (action.type) {
    case ROUTE_KEYS_UPDATE :
      return _updateRouteKeys(action.payload)
    default :
      return state
  }
}

const _updateRouteKeys = (payload) => {
  return fromJS(payload)
}
