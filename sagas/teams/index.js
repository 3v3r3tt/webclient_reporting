// vendor
import debug from 'debug'

import {
  takeEvery
} from 'redux-saga'

import {
    call,
    put
} from 'redux-saga/effects'

// lib
import {
   updateTeams,
   TEAMS_GET
} from 'reporting/actions/teams'

import config from 'components/__utils/config'

const error = debug('VO:sagas:error')

function _getTeams (api) {
  return function * (action) {
    try {
      const response = yield call(api.fetch, `/api/v2/org/${config.orgslug}/teams?include=policies`)
      yield put(updateTeams(response))
    } catch (err) {
      yield call(error, err)
    }
  }
}

export const Test = {
  _getTeams
}

// Watchers
// ---------------------------------------------------------------------------
export function * watchGetTeams (api) {
  yield * takeEvery(TEAMS_GET, _getTeams(api))
}
