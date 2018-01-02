import {
  createSelector
} from 'reselect'

const _getRouteKeys = state => state.routeKeys
export const getReducedRouteKeys = createSelector(
  [_getRouteKeys],
  state => {
    return state.map((routeKey) => {
      if (routeKey.get('isDefault')) return {id: routeKey.get('id'), label: 'Default Route Key'}
      else return {id: routeKey.get('id'), label: routeKey.get('routeKey')}
    })
  }
)
