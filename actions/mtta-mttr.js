// On-call Reports
export const MTTA_MTTR_TABLE_GET = 'MTTA_MTTR_TABLE_GET'
export const MTTA_MTTR_TABLE_UPDATE = 'MTTA_MTTR_TABLE_UPDATE'
export const MTTA_MTTR_INNER_TABLE_RESET = 'MTTA_MTTR_INNER_TABLE_RESET'
export const MTTA_MTTR_TABLE_ERROR = 'MTTA_MTTR_TABLE_ERROR'
export const MTTA_MTTR_GRAPH_GET = 'MTTA_MTTR_GRAPH_GET'
export const MTTA_MTTR_GRAPH_UPDATE = 'MTTA_MTTR_GRAPH_UPDATE'
export const MTTA_MTTR_GRAPH_ERROR = 'MTTA_MTTR_GRAPH_ERROR'
export const MTTA_MTTR_FILTER_UPDATE = 'MTTA_MTTR_FILTER_UPDATE'
export const MTTA_MTTR_TABLE_REDUCE = 'MTTA_MTTR_TABLE_REDUCE'
export const MTTA_MTTR_TABLE_RESET = 'MTTA_MTTR_TABLE_RESET'
export const MTTA_MTTR_INCIDENT_DETAIL_GET = 'MTTA_MTTR_INCIDENT_DETAIL_GET'
export const MTTA_MTTR_INCIDENT_DETAIL_UPDATE = 'MTTA_MTTR_INCIDENT_DETAIL_UPDATE'
export const MTTA_MTTR_INCIDENT_DETAIL_ERROR = 'MTTA_MTTR_INCIDENT_DETAIL_ERROR'

export function mttaMttrFilterUpdate (payload = {}) {
  return {
    type: MTTA_MTTR_FILTER_UPDATE,
    payload
  }
}

export function mttaMttrTableGet (payload = {}) {
  return {
    type: MTTA_MTTR_TABLE_GET,
    payload
  }
}

export function mttaMttrInnerTableReset (payload = {}) {
  return {
    type: MTTA_MTTR_INNER_TABLE_RESET,
    payload
  }
}

export function mttaMttrTableUpdate (payload = {}) {
  return {
    type: MTTA_MTTR_TABLE_UPDATE,
    payload
  }
}

export function mttaMttrTableError (payload = {}) {
  return {
    type: MTTA_MTTR_TABLE_ERROR,
    payload
  }
}

export function mttaMttrGraphGet (payload = {}) {
  return {
    type: MTTA_MTTR_GRAPH_GET,
    payload
  }
}

export function mttaMttrGraphUpdate (payload = {}) {
  return {
    type: MTTA_MTTR_GRAPH_UPDATE,
    payload
  }
}

export function mttaMttrGraphError (payload = {}) {
  return {
    type: MTTA_MTTR_GRAPH_ERROR,
    payload
  }
}

export function mttaMttrTableReduce (payload = {}) {
  return {
    type: MTTA_MTTR_TABLE_REDUCE,
    payload
  }
}

export function mttaMttrTableReset (payload = {}) {
  return {
    type: MTTA_MTTR_TABLE_RESET,
    payload
  }
}

export function mttaMttrIncidentDetailGet (payload = {}) {
  return {
    type: MTTA_MTTR_INCIDENT_DETAIL_GET,
    payload
  }
}

export function mttaMttrIncidentDetailUpdate (payload = {}) {
  return {
    type: MTTA_MTTR_INCIDENT_DETAIL_UPDATE,
    payload
  }
}

export function mttaMttrIncidentDetailError (payload = {}) {
  return {
    type: MTTA_MTTR_INCIDENT_DETAIL_ERROR,
    payload
  }
}
