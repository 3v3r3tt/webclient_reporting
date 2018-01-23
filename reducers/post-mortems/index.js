import { fromJS } from 'immutable'

import {
  POSTMORTEMS_UPDATE,
  POSTMORTEMS_GET,
  POSTMORTEM_DELETE
} from 'reporting/actions/post-mortems'

// Reducer
// ---------------------------------------------------------------------------

export const initialState = fromJS({
  data: [],
  isLoading: false
})

export default function PostMortemsReducer (state = initialState, action) {
  switch (action.type) {
    case POSTMORTEM_DELETE :
      return _removePostMortemByToken(state, action.payload.token)
    case POSTMORTEMS_GET :
      return _getPostMortems(state, action.payload)
    case POSTMORTEMS_UPDATE :
      return _updatePostMortems(state, action.payload)
    default :
      return state
  }
}

const _removePostMortemByToken = (state, token) => {
  return state.set('data', state.get('data').filter(o => o.get('token') !== token))
}

const _updatePostMortems = (state, payload) => {
  return state.set('data', fromJS(payload))
              .set('isLoading', false)
}

const _getPostMortems = (state, payload) => {
  return state.set('isLoading', true)
}
