import { fromJS } from 'immutable'

import {
  HIDE_MODAL,
  SHOW_MODAL,
  TOGGLE_MODAL
} from 'reporting/actions/iframemodal'

export const initialState = fromJS({
  open: false
})

export default function IframeModal (state = initialState, action) {
  switch (action.type) {
    case HIDE_MODAL:
      return state.update('open', () => false)
    case SHOW_MODAL:
      return state.update('open', () => true)
    case TOGGLE_MODAL:
      return state.update('open', () => !state.get('open'))
    default:
      return state
  }
}
