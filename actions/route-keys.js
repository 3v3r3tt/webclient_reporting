export const ROUTE_KEYS_GET = 'ROUTE_KEYS_GET'
export const ROUTE_KEYS_UPDATE = 'ROUTE_KEYS_UPDATE'

export function getRouteKeys (payload) {
  return {
    type: ROUTE_KEYS_GET,
    payload
  }
}

export function updateRouteKeys (payload) {
  return {
    type: ROUTE_KEYS_UPDATE,
    payload
  }
}
