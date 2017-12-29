// vendor
import {
  fork
} from 'redux-saga/effects'

import debug from 'debug'

import { watchGetOrgMeta } from './org-meta'
import { watchGetTeams } from './teams'

import {
  watchGetOnCallUserReport,
  watchGetOnCallTeamReport
} from './reporting-on-call'

import {
 watchGetIncidentFrequencyTable,
 watchGetIncidentFrequencyGraph,
 watchGetIncidentFrequencyIncidentDetails
} from './incident-frequency'

import {
 watchGetMttaMttrGraph
} from './mtta-mttr'

// lib
const error = debug('VO:sagas:error')

export default function makeRootSaga (api) {
  return function * rootSaga () {
    yield fork(watchGetOrgMeta)

    yield fork(watchGetTeams, api, error)

    yield fork(watchGetOnCallTeamReport, api, error)
    yield fork(watchGetOnCallUserReport, api, error)

    yield fork(watchGetIncidentFrequencyTable, api, error)
    yield fork(watchGetIncidentFrequencyGraph, api, error)
    yield fork(watchGetIncidentFrequencyIncidentDetails, api, error)

    yield fork(watchGetMttaMttrGraph, api, error)
  }
}
