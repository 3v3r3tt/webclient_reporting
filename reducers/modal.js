import { fromJS } from 'immutable'

import {
  HIDE_MODAL,
  SHOW_MODAL,
  TOGGLE_MODAL
} from 'reporting/actions/modal'

export const initialState = fromJS({
  open: false,
  config: null
})

export default function ReportingModal (state = initialState, action) {
  switch (action.type) {
    case HIDE_MODAL:
      return state.merge({
        open: false,
        config: null
      })
    case SHOW_MODAL:
      return state.merge({
        open: true,
        config: action.payload
      })
    case TOGGLE_MODAL:
      return state.update('open', !state.get('open'))
    default:
      return state
  }
}
