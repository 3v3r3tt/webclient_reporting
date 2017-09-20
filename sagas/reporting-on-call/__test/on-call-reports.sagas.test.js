import {
  expect
} from 'chai'

import {
  call,
  put,
  select
} from 'redux-saga/effects'

import config from 'components/__utils/config'

import {
  Test
} from '../index'

import * as Fixture from './fixture'

import {
  reportingOnCallTeamUpdate,
  reportingOnCallUserUpdate
} from 'reporting/actions/reporting'

const {
  _getOnCallTeamReport,
  _getOnCallUserReport
} = Test

const log = console.log

describe('sagas.on-call-report', function () {
  const api = {
    create: () => Promise.resolve(Fixture.onCallReportTeamData)
  }

  describe('getOnCallReportTeamData', function () {
    const action = {
      payload: {
        success: () => null,
        error: () => null
      }
    }

    const iterator = _getOnCallTeamReport(api, log)(action)
    const onCallReportDataGetState = iterator.next().value
    it('should get on-call report data from state', function () {
      expect(onCallReportDataGetState)
        .to.deep.equal(
          select(Test._getReportingOnCallState)
        )
    })

    const onCallReportDataFetch = iterator.next(Fixture.onCallReportTeamState).value
    it('should use state to get on-call report data from oncallmain endpoint', function () {
      expect(onCallReportDataFetch)
        .to.deep.equal(
          call(api.create, `/api/v1/org/${config.auth.org.slug}/reports/oncallmain`, Fixture.onCallReportTeamPayload.toJS())
        )
    })

    const onCallReportDataUpdate = iterator.next(Fixture.onCallReportTeamData).value
    it('should update store with on-call report data retrieved', function () {
      expect(onCallReportDataUpdate)
        .to.deep.equal(
          put(reportingOnCallTeamUpdate(Fixture.onCallReportTeamData))
        )
    })
  })

  describe('getOnCallReportUserData', function () {
    const action = {
      payload: {
        success: () => null
      }
    }

    const iterator = _getOnCallUserReport(api, log)(action)
    const getOnCallUserGetState = iterator.next().value
    it('should get on-call user data from state', function () {
      expect(getOnCallUserGetState)
        .to.deep.equal(
          select(Test._getReportingOnCallState)
        )
    })

    const fetchOnCallUserData = iterator.next(Fixture.onCallReportUserState).value
    it('should use state to get on-call report data from oncalluser endpoint', function () {
      expect(fetchOnCallUserData)
        .to.deep.equal(
          call(api.create, `/api/v1/org/${config.auth.org.slug}/reports/oncalluser`, Fixture.onCallReportUserPayload.toJS())
        )
    })

    const onCallReportUserDataUpdate = iterator.next(Fixture.onCallReportUserData).value
    it('should update store with on-call report user data retrieved', function () {
      expect(onCallReportUserDataUpdate)
        .to.deep.equal(
          put(reportingOnCallUserUpdate(Fixture.onCallReportUserData))
        )
    })
  })
})
