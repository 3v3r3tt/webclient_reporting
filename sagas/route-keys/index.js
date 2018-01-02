import debug from 'debug'

import { takeEvery } from 'redux-saga'

import {
    call,
    put
} from 'redux-saga/effects'

import {
   updateRouteKeys,
   ROUTE_KEYS_GET
} from 'reporting/actions/route-keys'

import config from 'components/__utils/config'

const error = debug('VO:sagas:error')

function _getRouteKeys (api) {
  return function * (action) {
    try {
      const response = yield call(api.fetch, `/api/v2/org/${config.orgslug}/routes`)
      yield put(updateRouteKeys(response))
    } catch (err) {
      error(err)
    }
  }
}

export const Test = {
  _getRouteKeys
}

// Watchers
// ---------------------------------------------------------------------------
export function * watchGetRouteKeys (api) {
  yield * takeEvery(ROUTE_KEYS_GET, _getRouteKeys(api))
}
