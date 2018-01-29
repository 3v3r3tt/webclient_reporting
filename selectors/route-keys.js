import {
  createSelector
} from 'reselect'

const _getRouteKeys = state => state.routeKeys
export const getReducedRouteKeys = createSelector(
  [_getRouteKeys],
  state => {
    return state.map((routeKey) => {
      if (routeKey.get('isDefault')) return {id: '', label: 'Default Route Key'}
      else return {id: routeKey.get('routeKey'), label: routeKey.get('routeKey')}
    }).sort((a, b) => {
      return a.label.localeCompare(b.label)
    })
  }
)
