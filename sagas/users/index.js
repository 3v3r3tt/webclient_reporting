import debug from 'debug'

import { takeEvery } from 'redux-saga'

import {
    call,
    put
} from 'redux-saga/effects'

import {
   updateUsers,
   USERS_GET
} from 'reporting/actions/users'

import config from 'components/__utils/config'

const error = debug('VO:sagas:error')

function _getUsers (api) {
  return function * (action) {
    try {
      let usersResponse = yield call(api.fetch, `/api/v1/org/${config.orgslug}/users`)
      yield put(updateUsers(usersResponse))
    } catch (err) {
      yield call(error, err)
    }
  }
}

export const Test = {
  _getUsers
}

// Watchers
// ---------------------------------------------------------------------------
export function * watchGetUsers (api) {
  yield * takeEvery(USERS_GET, _getUsers(api))
}
