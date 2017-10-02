// On-call Reports
export const INCIDENT_FREQUENCY_TEAM_GET = 'INCIDENT_FREQUENCY_TEAM_GET'
export const INCIDENT_FREQUENCY_TEAM_UPDATE = 'INCIDENT_FREQUENCY_TEAM_UPDATE'
export const INCIDENT_FREQUENCY_TEAM_ERROR = 'INCIDENT_FREQUENCY_TEAM_ERROR'
export const INCIDENT_FREQUENCY_FILTER_UPDATE = 'INCIDENT_FREQUENCY_FILTER_UPDATE'

export function incidentFrequencyFilterUpdate (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_FILTER_UPDATE,
    payload
  }
}

export function incidentFrequencyTeamGet (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_TEAM_GET,
    payload
  }
}

export function incidentFrequencyTeamUpdate (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_TEAM_UPDATE,
    payload
  }
}

export function incidentFrequencyTeamError (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_TEAM_ERROR,
    payload
  }
}
