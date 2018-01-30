// APP wide selectors

import {
  fromJS
} from 'immutable'

import {
  createSelector
} from 'reselect'

const _metaFlags = (state) => state.meta
const _getTeams = state => state.teams

export const getTeams = createSelector(
  [_getTeams],
  state => {
    return state
      .map(el => el.set('name', unescape(el.get('name', ''))))
      .sortBy((_, key) => {
        return key
      })
  }
)

export const getCompleteProfileStatus = createSelector(
  [_metaFlags],
  state => {
    const hasPhone = state.getIn(['metaFlags', 'flag:setup:phone'], false)
    const hasPolicy = state.getIn(['metaFlags', 'flag:setup:profile'], false)

    return fromJS({
      hasPhone: hasPhone,
      hasPolicy: hasPolicy,
      hasAll: hasPhone && hasPolicy
    })
  }
)
