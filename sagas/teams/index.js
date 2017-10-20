import debug from 'debug'

import { takeEvery } from 'redux-saga'

import {
    call,
    put
} from 'redux-saga/effects'

import {
   updateTeams,
   TEAMS_GET
} from 'reporting/actions/teams'

import config from 'components/__utils/config'

const error = debug('VO:sagas:error')

function _getTeams (api) {
  return function * (action) {
    try {
      let teamsResponse = yield call(api.fetch, `/api/v2/org/${config.orgslug}/teams?include=policies`)
      if (action.payload && action.payload.filterBy) {
        const userTeamsResponse = yield call(api.fetch, `/api/v1/org/${config.orgslug}/users/${action.payload.filterBy}/teams`)
        const userTeams = userTeamsResponse.teams.map((t) => t.team.slug)
        teamsResponse = teamsResponse.filter((t) => userTeams.indexOf(t.slug) > -1)
      }

      yield put(updateTeams(teamsResponse))
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
