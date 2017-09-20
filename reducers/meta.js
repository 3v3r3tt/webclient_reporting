import { Map, fromJS } from 'immutable'
import { omit as _omit } from 'lodash'

import {
  ORG_META_FETCH,
  ORG_META_UPDATE
} from 'reporting/actions/meta'

export const initialState = Map({
  metaFlags: null,
  featureFlags: null,
  isFetching: false
})

export default function auth (state = initialState, action) {
  switch (action.type) {
    case ORG_META_FETCH:
      return state
        .update('isFetching', () => true)
    case ORG_META_UPDATE:
      const metaFlags = _omit(action.payload, '_priv')
      return state
        .update('metaFlags', () => fromJS(metaFlags))
        .update('featureFlags', () => fromJS(action.payload._priv))
        .update('isFetching', () => false)
    default:
      return state
  }
}
