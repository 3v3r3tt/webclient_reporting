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
import { fetch } from 'components/__utils/xhr'
import config from 'components/__utils/config'

import {
    updateOrgMeta,
    ORG_META_FETCH
} from 'components/store/actions'

const error = debug('VO:sagas:error')

export function * watchGetOrgMeta () {
  yield * takeEvery(ORG_META_FETCH, getOrgMeta)
}

export function * getOrgMeta () {
  try {
    const results = yield call(fetch, `/api/v1/org/${config.orgslug}/meta`)
    yield put(updateOrgMeta(results))
  } catch (err) {
    error(err)
  }
}
