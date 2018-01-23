// vendor
import {
  fork
} from 'redux-saga/effects'

import debug from 'debug'

import { watchGetOrgMeta } from './org-meta'
import { watchGetTeams } from './teams'
import { watchGetUsers } from './users'

import {
  watchGetPostMortems,
  watchDeletePostMortems
} from './post-mortems'

import {
  watchGetOnCallUserReport,
  watchGetOnCallTeamReport
} from './reporting-on-call'

import {
 watchGetRouteKeys
} from './route-keys'

import {
 watchGetIncidentFrequencyTable,
 watchGetIncidentFrequencyGraph,
 watchGetIncidentFrequencyIncidentDetails
} from './incident-frequency'

import {
 watchGetMttaMttrGraph,
 watchGetMttaMttrTable
} from './mtta-mttr'

import {
  watchCreatePostMortemActionItem,
  watchGetPostMortemActionItems,
  watchGetPostMortemBySlug,
  watchGetPostMortemTimelineNotes,
  watchPostMortemDateRangeUpdate,
  watchPostMortemFormSave,
  watchRemovePostMortemActionItem
} from './post-mortem'

// lib
const error = debug('VO:sagas:error')

export default function makeRootSaga (api) {
  return function * rootSaga () {
    yield fork(watchGetOrgMeta)

    yield fork(watchDeletePostMortems, api, error)
    yield fork(watchGetPostMortems, api, error)
    yield fork(watchGetTeams, api, error)
    yield fork(watchGetUsers, api, error)

    yield fork(watchGetOnCallTeamReport, api, error)
    yield fork(watchGetOnCallUserReport, api, error)

    yield fork(watchGetRouteKeys, api, error)

    yield fork(watchGetIncidentFrequencyGraph, api, error)
    yield fork(watchGetIncidentFrequencyIncidentDetails, api, error)
    yield fork(watchGetIncidentFrequencyTable, api, error)

    yield fork(watchGetMttaMttrGraph, api, error)
    yield fork(watchGetMttaMttrTable, api, error)

    yield fork(watchCreatePostMortemActionItem, api, error)
    yield fork(watchGetPostMortemActionItems, api, error)
    yield fork(watchGetPostMortemBySlug, api, error)
    yield fork(watchGetPostMortemTimelineNotes, api, error)
    yield fork(watchPostMortemDateRangeUpdate, api, error)
    yield fork(watchPostMortemFormSave, api, error)
    yield fork(watchRemovePostMortemActionItem, api, error)
  }
}
