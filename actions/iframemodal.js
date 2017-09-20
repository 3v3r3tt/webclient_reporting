export const HIDE_MODAL = 'HIDE_MODAL'
export const SHOW_MODAL = 'SHOW_MODAL'
export const TOGGLE_MODAL = 'TOGGLE_MODAL'

export function hideModal () {
  return {
    type: HIDE_MODAL
  }
}

export function showModal () {
  return {
    type: SHOW_MODAL
  }
}

export function toggleModal () {
  return {
    type: TOGGLE_MODAL
  }
}
