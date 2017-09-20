import { expect } from 'chai'

import {
  call,
  put
} from 'redux-saga/effects'

import {
    Test
} from '../index'

import {
    updateTeams
} from 'components/store/actions'

import config from 'components/__utils/config'

const {
    _getTeams
} = Test

describe('sagas.reports.teams', function () {
  const action = {
    payload: {
      orgslug: 'test'
    }
  }

  const api = {
    fetch: () => Promise.resolve()
  }

  const iterator = _getTeams(api)(action)

  const resp = {
    'slug': 'newteam',
    'name': 'NewTeam',
    'memberCount': 0,
    'isDefaultTeam': false,
    'version': 0,
    '_policies': [
      {
        'slug': 'newteam',
        'name': 'NewTeam'
      }
    ]
  }

  it('fetches teams', function () {
    expect(iterator.next(resp).value)
      .to.deep.equal(call(api.fetch, `/api/v2/org/${config.orgslug}/teams?include=policies`))
  })

  it('calls reducer to update teams', function () {
    expect(iterator.next(resp).value)
      .to.deep.equal(put(updateTeams(resp)))
  })
})
