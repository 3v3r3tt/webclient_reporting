export const POSTMORTEMS_GET = 'POSTMORTEMS_GET'
export const POSTMORTEMS_UPDATE = 'POSTMORTEMS_UPDATE'
export const POSTMORTEM_DELETE = 'POSTMORTEM_DELETE'

export function getPostMortems (payload) {
  return {
    type: POSTMORTEMS_GET,
    payload
  }
}

export function updatePostMortems (payload) {
  return {
    type: POSTMORTEMS_UPDATE,
    payload
  }
}
export function deletePostMortem (payload) {
  return {
    type: POSTMORTEM_DELETE,
    payload
  }
}
