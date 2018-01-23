// vendor
import {
  takeEvery
} from 'redux-saga'

import {
  put,
  select,
  call
} from 'redux-saga/effects'

// lib
import {
  POST_MORTEM_ACTION_ITEMS_CREATE,
  POST_MORTEM_ACTION_ITEMS_GET,
  POST_MORTEM_ACTION_ITEMS_REMOVE,
  POST_MORTEM_DATE_UPDATE,
  POST_MORTEM_GET,
  POST_MORTEM_SAVE_FORM,
  POST_MORTEM_TIMELINE_NOTES_GET,
  getPostMortemActionItems,
  updatePostMortem,
  updatePostMortemActionItems,
  updatePostMortemTimelineNotes
} from 'reporting/actions/post-mortem'

import config from 'components/__utils/config'

export const _getPostMortemState = (state) => state.postMortem.get('report').toJS()

function _savePostMortem ({create}, logError) {
  return function * (action) {
    try {
      const reportFormData = yield select(_getPostMortemState)
      if (reportFormData.end && reportFormData.end && reportFormData.title) {
        const headerData = {
          exclude: reportFormData.exclude,
          begin: reportFormData.begin,
          end: reportFormData.end,
          title: reportFormData.title,
          annotations: reportFormData.annotations,
          can_edit: reportFormData.can_edit,
          can_delete: reportFormData.can_delete,
          is_customer_impacted: reportFormData.is_customer_impacted
        }

        const postmortemEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/postmortems`
        const savedPostMortem = yield call(create, postmortemEndpoint, headerData)
        yield put(updatePostMortem(savedPostMortem))
      }
    } catch (err) {
      yield call(logError, err)
    }
  }
}

function _getPostMortemBySlug ({fetch}, logError) {
  return function * (action) {
    const {
      payload: {
        reportId
      }
    } = action
    try {
      if (reportId) {
        const actionItemsEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/postmortems/${reportId}`
        const actionItems = yield call(fetch, actionItemsEndpoint)
        yield put(updatePostMortem(actionItems))
      }
    } catch (err) {
      yield call(logError, err)
    }
  }
}

function _getPostMortemActionItems ({fetch}, logError) {
  return function * (action) {
    const {
      payload: {
        reportId
      }
    } = action
    try {
      if (reportId) {
        const actionItemsEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/postmortems/${reportId}/actionitems`
        const actionItems = yield call(fetch, actionItemsEndpoint)
        yield put(updatePostMortemActionItems(actionItems))
      }
    } catch (err) {
      yield call(logError, err)
    }
  }
}

function _createPostMortemActionItem ({create}, logError) {
  return function * (action) {
    const {
      payload: {
        reportId,
        actionItemToAdd,
        success
      }
    } = action
    try {
      yield call(create, `/api/v1/org/${config.auth.org.slug}/reports/postmortems/${reportId}/actionitems`, actionItemToAdd)
      yield put(getPostMortemActionItems({reportId: reportId}))
      yield call(success)
    } catch (err) {
      yield call(logError, err)
    }
  }
}

function _removePostMortemActionItem ({destroy}, logError) {
  return function * (action) {
    const {
      payload: {
        actionItemIdToRemove,
        reportId,
        success
      }
    } = action

    try {
      yield call(destroy, `/api/v1/org/${config.auth.org.slug}/reports/postmortems/${reportId}/actionitems/${actionItemIdToRemove}`)
      yield put(getPostMortemActionItems({reportId: reportId}))
      yield call(success)
    } catch (err) {
      yield call(logError, err)
    }
  }
}

function _getPostMortemTimelineNotes ({fetch}, logError) {
  return function * (action) {
    console.log('this')
    const {
      payload: {
        reportId
      }
    } = action
    try {
      let annotatedTimelineNotes = []
      if (reportId) {
        const reportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/postmortems/${reportId}`
        const reportResponse = yield call(fetch, reportEndpoint)

        const timelineEndpoint = `/api/v1/org/${config.auth.org.slug}/reporting/timeline?p.begin=${reportResponse.begin}&p.end=${reportResponse.end}&p.limit=1000`
        const timelineResponse = yield call(fetch, timelineEndpoint)

        const sequenceTimeMap = {}
        timelineResponse.timeline.forEach(
          (t) => { sequenceTimeMap[t.sequence] = t.serviceTime }
        )
        annotatedTimelineNotes = reportResponse.annotations
        annotatedTimelineNotes.forEach((aA) => {
          aA.timeStamp = sequenceTimeMap[aA.sequence] || 'N/A'
        })
      } else {
        annotatedTimelineNotes = []
      }

      yield put(updatePostMortemTimelineNotes(annotatedTimelineNotes))
    } catch (err) {
      yield call(logError, err)
    }
  }
}
export const Test = {
  _getPostMortemActionItems,
  _createPostMortemActionItem,
  _removePostMortemActionItem,
  _getPostMortemTimelineNotes
}

export function * watchPostMortemDateRangeUpdate (api, logError) {
  yield * takeEvery(POST_MORTEM_DATE_UPDATE, _savePostMortem(api, logError))
}

export function * watchPostMortemFormSave (api, logError) {
  yield * takeEvery(POST_MORTEM_SAVE_FORM, _savePostMortem(api, logError))
}

export function * watchGetPostMortemActionItems (api, logError) {
  yield * takeEvery(POST_MORTEM_ACTION_ITEMS_GET, _getPostMortemActionItems(api, logError))
}

export function * watchCreatePostMortemActionItem (api, logError) {
  yield * takeEvery(POST_MORTEM_ACTION_ITEMS_CREATE, _createPostMortemActionItem(api, logError))
}

export function * watchRemovePostMortemActionItem (api, logError) {
  yield * takeEvery(POST_MORTEM_ACTION_ITEMS_REMOVE, _removePostMortemActionItem(api, logError))
}

export function * watchGetPostMortemTimelineNotes (api, logError) {
  yield * takeEvery(POST_MORTEM_TIMELINE_NOTES_GET, _getPostMortemTimelineNotes(api, logError))
}

export function * watchGetPostMortemBySlug (api, logError) {
  yield * takeEvery(POST_MORTEM_GET, _getPostMortemBySlug(api, logError))
}
