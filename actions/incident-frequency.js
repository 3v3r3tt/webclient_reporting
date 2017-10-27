// On-call Reports
export const INCIDENT_FREQUENCY_TABLE_GET = 'INCIDENT_FREQUENCY_TABLE_GET'
export const INCIDENT_FREQUENCY_TABLE_UPDATE = 'INCIDENT_FREQUENCY_Table_UPDATE'
export const INCIDENT_FREQUENCY_TABLE_ERROR = 'INCIDENT_FREQUENCY_Table_ERROR'
export const INCIDENT_FREQUENCY_GRAPH_GET = 'INCIDENT_FREQUENCY_GRAPH_GET'
export const INCIDENT_FREQUENCY_GRAPH_UPDATE = 'INCIDENT_FREQUENCY_GRAPH_UPDATE'
export const INCIDENT_FREQUENCY_GRAPH_ERROR = 'INCIDENT_FREQUENCY_GRAPH_ERROR'
export const INCIDENT_FREQUENCY_FILTER_UPDATE = 'INCIDENT_FREQUENCY_FILTER_UPDATE'
export const INCIDENT_FREQUENCY_TABLE_REDUCE = 'INCIDENT_FREQUENCY_TABLE_REDUCE'
export const INCIDENT_FREQUENCY_TABLE_RESET = 'INCIDENT_FREQUENCY_TABLE_RESET'

export function incidentFrequencyFilterUpdate (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_FILTER_UPDATE,
    payload
  }
}

export function incidentFrequencyTableGet (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_TABLE_GET,
    payload
  }
}

export function incidentFrequencyTableUpdate (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_TABLE_UPDATE,
    payload
  }
}

export function incidentFrequencyTableError (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_TABLE_ERROR,
    payload
  }
}

export function incidentFrequencyGraphGet (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_GRAPH_GET,
    payload
  }
}

export function incidentFrequencyGraphUpdate (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_GRAPH_UPDATE,
    payload
  }
}

export function incidentFrequencyGraphError (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_GRAPH_ERROR,
    payload
  }
}

export function incidentFrequencyTableReduce (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_TABLE_REDUCE,
    payload
  }
}

export function incidentFrequencyTableReset (payload = {}) {
  return {
    type: INCIDENT_FREQUENCY_TABLE_RESET,
    payload
  }
}
