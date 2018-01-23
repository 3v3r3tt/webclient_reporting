export const USERS_GET = 'USERS_GET'
export const USERS_UPDATE = 'USERS_UPDATE'

export function getUsers (payload) {
  return {
    type: USERS_GET,
    payload
  }
}

export function updateUsers (payload) {
  return {
    type: USERS_UPDATE,
    payload
  }
}
