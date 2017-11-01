export const HIDE_MODAL = 'HIDE_MODAL'
export const SHOW_MODAL = 'SHOW_MODAL'
export const TOGGLE_MODAL = 'TOGGLE_MODAL'

export function hideModal (payload) {
  return {
    type: HIDE_MODAL,
    payload
  }
}

export function showModal (payload) {
  return {
    type: SHOW_MODAL,
    payload
  }
}

export function toggleModal (payload) {
  return {
    type: TOGGLE_MODAL,
    payload
  }
}
