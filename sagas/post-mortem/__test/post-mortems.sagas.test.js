import {
  expect
} from 'chai'

import {
  call,
  put
} from 'redux-saga/effects'

import config from 'components/__utils/config'

import {
  Test
} from '../index'

import * as Fixture from './fixture'

import {
  getPostMortemActionItems,
  updatePostMortemActionItems,
  updatePostMortemTimelineNotes
} from 'reporting/actions/post-mortem'

const {

  _getPostMortemActionItems,
  _createPostMortemActionItem,
  _removePostMortemActionItem,
  _getPostMortemTimelineNotes
} = Test

const log = console.log

describe('sagas.post-mortems.action-items', function () {
  const api = {
    remove: () => Promise.resolve(null),
    fetch: () => Promise.resolve(Fixture.actionItems.getResponse),
    create: () => Promise.resolve(true),
    destroy: () => Promise.resolve(true)
  }

  describe('getActionItems', function () {
    const action = {
      payload: {
        success: () => null,
        error: () => null,
        reportId: 'kj12l32kljx12'
      }
    }

    const iterator = _getPostMortemActionItems(api, log, action.payload.reportId)(action)
    const actionItemsFetch = iterator.next({reportId: action.payload.reportId}).value

    it('should get post mortem action items from backend', function () {
      expect(actionItemsFetch)
        .to.deep.equal(
          call(api.fetch, `/api/v1/org/${config.auth.org.slug}/reports/postmortems/${action.payload.reportId}/actionitems`)
        )
    })

    const actionItemsUpdate = iterator.next(Fixture.actionItems.getResponse).value
    it('should update post mortem action items in store', function () {
      expect(actionItemsUpdate)
        .to.deep.equal(
          put(updatePostMortemActionItems(Fixture.actionItems.getResponse))
        )
    })
  })

  describe('createActionItem', function () {
    const action = {
      payload: {
        success: () => null,
        actionItemToAdd: { body: 'A new action item thingy' },
        reportId: 'kj12l32kljx12'
      }
    }
    const iterator = _createPostMortemActionItem(api, log, action.payload.reportId)(action)
    const actionItemsCreate = iterator.next().value
    it('should create new post mortem action item', function () {
      expect(actionItemsCreate)
        .to.deep.equal(
          call(api.create, `/api/v1/org/${config.auth.org.slug}/reports/postmortems/${action.payload.reportId}/actionitems`, action.payload.actionItemToAdd)
        )
    })

    const actionItemsFetch = iterator.next({reportId: action.payload.reportId}).value
    it('should get new post mortem action items after creation', function () {
      expect(actionItemsFetch)
        .to.deep.equal(
          put(getPostMortemActionItems({reportId: action.payload.reportId}))
        )
    })
  })

  describe('removeActionItem', function () {
    const action = {
      payload: {
        actionItemIdToRemove: 3,
        reportId: 'kj12l32kljx12'
      }
    }

    const iterator = _removePostMortemActionItem(api, log)(action)
    const actionItemsDestroy = iterator.next().value
    it('should remove action item from action items', function () {
      expect(actionItemsDestroy)
        .to.deep.equal(
          call(api.destroy, `/api/v1/org/${config.auth.org.slug}/reports/postmortems/${action.payload.reportId}/actionitems/${action.payload.actionItemIdToRemove}`)
        )
    })

    const actionItemsFetch = iterator.next({repotId: action.payload.repotId}).value
    it('should get new post mortem action items after removal', function () {
      expect(actionItemsFetch)
        .to.deep.equal(
          put(getPostMortemActionItems({reportId: action.payload.reportId}))
        )
    })
  })

  describe('getTimelineNotes', function () {
    const action = {
      payload: {
        reportId: 'kj12l32kljx12'
      }
    }
    const iterator = _getPostMortemTimelineNotes(api, log)(action)
    const reportFetch = iterator.next().value

    it('should get post mortem report', function () {
      expect(reportFetch)
        .to.deep.equal(
          call(api.fetch, `/api/v1/org/${config.auth.org.slug}/reports/postmortems/${action.payload.reportId}`)
        )
    })

    const timelineFetch = iterator.next(Fixture.report.getResponse).value
    it('should get timeline for time span specified by report start and end', function () {
      expect(timelineFetch)
        .to.deep.equal(
          call(api.fetch, `/api/v1/org/${config.auth.org.slug}/reporting/timeline?p.begin=${Fixture.report.getResponse.begin}&p.end=${Fixture.report.getResponse.end}&p.limit=1000`)
        )
    })

    const updateTimelineNotes = iterator.next(Fixture.timeline.getResponse).value
    it('should get annotated timeline notes with date/time from timeline', function () {
      expect(updateTimelineNotes)
        .to.deep.equal(
          put(updatePostMortemTimelineNotes(Fixture.annotatedTimelineNotes))
        )
    })
  })
})
