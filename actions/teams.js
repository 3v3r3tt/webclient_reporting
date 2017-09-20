export const TEAMS_GET = 'TEAMS_GET'
export const TEAMS_UPDATE = 'TEAMS_UPDATE'

export function getTeams () {
  return {
    type: TEAMS_GET
  }
}

export function updateTeams (payload) {
  return {
    type: TEAMS_UPDATE,
    payload
  }
}
