import debug from 'debug'

import { takeEvery } from 'redux-saga'

import {
    call,
    put
} from 'redux-saga/effects'

import {
  updatePostMortems,
  POSTMORTEM_DELETE,
  POSTMORTEMS_GET
} from 'reporting/actions/post-mortems'

import config from 'components/__utils/config'

const error = debug('VO:sagas:error')

function _getPostMortems (api) {
  return function * (action) {
    try {
      let postmortemresponse = yield call(api.fetch, `/api/v1/org/${config.orgslug}/reports/postmortems`)
      yield put(updatePostMortems(postmortemresponse))
    } catch (err) {
      yield call(error, err)
    }
  }
}
function _deletePostMortems (api) {
  return function * (action) {
    const {
      payload: {
        token
      }
    } = action
    console.log('token', token)
    try {
      yield call(api.destroy, `/api/v1/org/${config.orgslug}/reports/postmortems/${token}`)
    } catch (err) {
      yield call(error, err)
    }
  }
}

export const Test = {
  _getPostMortems
}

// Watchers
// ---------------------------------------------------------------------------
export function * watchGetPostMortems (api) {
  yield * takeEvery(POSTMORTEMS_GET, _getPostMortems(api))
}

export function * watchDeletePostMortems (api) {
  yield * takeEvery(POSTMORTEM_DELETE, _deletePostMortems(api))
}
