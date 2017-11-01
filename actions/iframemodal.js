export const HIDE_IFRAME_MODAL = 'HIDE_IFRAME_MODAL'
export const SHOW_IFRAME_MODAL = 'SHOW_IFRAME_MODAL'
export const TOGGLE_IFRAME_MODAL = 'TOGGLE_IFRAME_MODAL'

export function hideIframeModal () {
  return {
    type: HIDE_IFRAME_MODAL
  }
}

export function showIframeModal () {
  return {
    type: SHOW_IFRAME_MODAL
  }
}

export function toggleIframeModal () {
  return {
    type: TOGGLE_IFRAME_MODAL
  }
}
