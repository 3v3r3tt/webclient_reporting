export const ORG_META_FETCH = 'ORG_META_FETCH'
export const ORG_META_UPDATE = 'ORG_META_UPDATE'
export const ORG_STATE = 'ORG_STATE'

// OrgMeta
// ---------------------------------------------------------------------------

export function getOrgMeta (payload) {
  return {
    type: ORG_META_FETCH,
    payload
  }
}

export function updateOrgMeta (payload) {
  return {
    type: ORG_META_UPDATE,
    payload
  }
}

// OrgState
// ---------------------------------------------------------------------------

export function updateOrgState (payload) {
  return {
    type: ORG_STATE,
    payload
  }
}
