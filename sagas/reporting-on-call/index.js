import { takeEvery } from 'redux-saga'

import {
  put,
  call,
  select
} from 'redux-saga/effects'

import {
  REPORTING_ONCALL_TEAM_GET,
  REPORTING_ONCALL_USER_GET,
  reportingOnCallTeamUpdate,
  reportingOnCallTeamError,
  reportingOnCallUserUpdate,
  reportingOnCallUserError
} from 'reporting/actions/reporting'

import moment from 'moment'

import config from 'components/__utils/config'

export const _getReportingOnCallState = (state) => state.reportingOnCall

function _getOnCallTeamReport ({create}, logError) {
  return function * () {
    try {
      let onCallReportEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/oncallmain`
      let reportingState = yield select(_getReportingOnCallState)
      const data = {
        team: reportingState.get('selectedTeam', ''),
        begin: reportingState.get('beginDate'),
        end: _determineRequestEndDate(reportingState.get('endDate'))
      }

      const onCallReportData = yield call(create, onCallReportEndpoint, data)
      yield put(reportingOnCallTeamUpdate(onCallReportData))
    } catch (err) {
      yield call(logError, err)
      yield put(reportingOnCallTeamError({error: {list: true}}))
    }
  }
}

function _getOnCallUserReport ({create}, logError) {
  return function * () {
    try {
      const onCallReportUserEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/oncalluser`
      let reportingState = yield select(_getReportingOnCallState)

      const data = {
        user: reportingState.get('selectedUser', ''),
        team: reportingState.get('selectedTeam', ''),
        begin: reportingState.get('beginDate'),
        end: _determineRequestEndDate(reportingState.get('endDate'))
      }
      const userOnCallReportData = yield call(create, onCallReportUserEndpoint, data)
      yield put(reportingOnCallUserUpdate(userOnCallReportData))
    } catch (err) {
      if (err.status === 504) {
        const api = {
          create: create
        }
        _getOnCallUserReport(api, logError)
      }
      yield call(logError, err)
      yield put(reportingOnCallUserError({error: {detail: true}}))
    }
  }
}

function _determineRequestEndDate (endDate) {
  const today = moment()
  const endMoment = moment(endDate)
  if (!endMoment.isSame(today, 'day')) {
    return endMoment.endOf('day').valueOf()
  } else {
    return endDate
  }
}

export const Test = {
  _getOnCallTeamReport,
  _getOnCallUserReport,
  _getReportingOnCallState
}

export function * watchGetOnCallTeamReport (api, logError) {
  yield * takeEvery(REPORTING_ONCALL_TEAM_GET, _getOnCallTeamReport(api, logError))
}

export function * watchGetOnCallUserReport (api, logError) {
  yield * takeEvery(REPORTING_ONCALL_USER_GET, _getOnCallUserReport(api, logError))
}
