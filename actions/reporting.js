// On-call Reports
export const REPORTING_ONCALL_TEAM_GET = 'REPORTING_ONCALL_TEAM_GET'
export const REPORTING_ONCALL_TEAM_UPDATE = 'REPORTING_ONCALL_TEAM_UPDATE'
export const REPORTING_ONCALL_USER_GET = 'REPORTING_ONCALL_USER_GET'
export const REPORTING_ONCALL_USER_UPDATE = 'REPORTING_ONCALL_USER_UPDATE'
export const REPORTING_ONCALL_FILTER_UPDATE = 'REPORTING_ONCALL_FILTER_UPDATE'

export function reportingOnCallFilterUpdate (payload = {}) {
  return {
    type: REPORTING_ONCALL_FILTER_UPDATE,
    payload
  }
}

export function reportingOnCallTeamGet (payload = {}) {
  return {
    type: REPORTING_ONCALL_TEAM_GET,
    payload
  }
}

export function reportingOnCallTeamUpdate (payload = {}) {
  return {
    type: REPORTING_ONCALL_TEAM_UPDATE,
    payload
  }
}

export function reportingOnCallUserGet (payload = {}) {
  return {
    type: REPORTING_ONCALL_USER_GET,
    payload
  }
}

export function reportingOnCallUserUpdate (payload = {}) {
  return {
    type: REPORTING_ONCALL_USER_UPDATE,
    payload
  }
}
