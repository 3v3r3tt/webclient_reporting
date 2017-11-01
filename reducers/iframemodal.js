import { fromJS } from 'immutable'

import {
  HIDE_IFRAME_MODAL,
  SHOW_IFRAME_MODAL,
  TOGGLE_IFRAME_MODAL
} from 'reporting/actions/iframemodal'

export const initialState = fromJS({
  open: false
})

export default function IframeModal (state = initialState, action) {
  switch (action.type) {
    case HIDE_IFRAME_MODAL:
      return state.update('open', () => false)
    case SHOW_IFRAME_MODAL:
      return state.update('open', () => true)
    case TOGGLE_IFRAME_MODAL:
      return state.update('open', () => !state.get('open'))
    default:
      return state
  }
}
