export const TEAMS_GET = 'TEAMS_GET'
export const TEAMS_UPDATE = 'TEAMS_UPDATE'

export function getTeams (payload) {
  return {
    type: TEAMS_GET,
    payload
  }
}

export function updateTeams (payload) {
  return {
    type: TEAMS_UPDATE,
    payload
  }
}
