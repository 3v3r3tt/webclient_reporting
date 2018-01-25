// vendor
import {
  createSelector
} from 'reselect'

import {
  fromJS,
  List
} from 'immutable'

import {
  clone as _clone
} from 'lodash'

import moment from 'moment-timezone'
import { getReducedRouteKeys } from './route-keys'

// ---------------------------------------------------------------------------

const _metaFlags = (state) => state.meta
const _getTeams = state => state.teams
const _getReportingUserOnCall = state => state.reportingOnCall

// ---------------------------------------------------------------------------
export { getReducedRouteKeys }

export const getCompleteProfileStatus = createSelector(
  [_metaFlags],
  state => {
    const hasPhone = state.getIn(['metaFlags', 'flag:setup:phone'], false)
    const hasPolicy = state.getIn(['metaFlags', 'flag:setup:profile'], false)

    return fromJS({
      hasPhone: hasPhone,
      hasPolicy: hasPolicy,
      hasAll: hasPhone && hasPolicy
    })
  }
)

export const getTeams = createSelector(
  [_getTeams],
  state => {
    return state
      .map(el => el.set('name', unescape(el.get('name', ''))))
      .sortBy((_, key) => {
        return key
      })
  }
)

export const getReportingUserOnCall = createSelector(
  [_getReportingUserOnCall],
  state => {
    const ON_CALL_LIMIT = 101
    const timeZone = moment.tz.guess()

    const spansMultipleDays = (onCall) => {
      const localStart = moment(onCall.get('start_epoch')).tz(timeZone)
      const localEnd = moment(onCall.get('end_epoch')).tz(timeZone)
      return !localStart.isSame(localEnd, 'day')
    }

    const segmentByDay = (onCall) => {
      let segmented = List()
      let currentOnCall = onCall
      while (spansMultipleDays(currentOnCall) && segmented.size < ON_CALL_LIMIT) {
        let localStart = moment(currentOnCall.get('start_epoch')).tz(timeZone)
        const newOnCallSegment = currentOnCall.set('end_epoch', localStart.endOf('day').valueOf())
        segmented = segmented.push(newOnCallSegment)
        currentOnCall = currentOnCall.set('start_epoch', localStart.endOf('day').add(1, 'millisecond').valueOf())
      }
      segmented = segmented.push(currentOnCall)
      return segmented
    }

    const nonSegmentedOnCalls = state.getIn(['userData', 'on_call'], List())
    let segmentedOnCalls = List()
    nonSegmentedOnCalls.forEach((onCall) => {
      // Make sure API returns a start that is before the end to avoid infinite while loop
      if (onCall.get('start_epoch') < onCall.get('end_epoch')) {
        if (segmentedOnCalls.size < ON_CALL_LIMIT) {
          if (spansMultipleDays(onCall)) {
            segmentedOnCalls = segmentedOnCalls.concat(segmentByDay(onCall))
          } else {
            segmentedOnCalls = segmentedOnCalls.push(onCall)
          }
        }
      }
    })

    return segmentedOnCalls
  }
)

const _getIncidentFrequencyStart = state => state.incidentFrequency.get('beginDate')
const _getIncidentFrequencyEnd = state => state.incidentFrequency.get('endDate')
const _getIncidentFrequencyResolutionType = state => state.incidentFrequency.getIn(['resolutionType', 'type'])
const _getIncidentFrequencyGraphData = state => state.incidentFrequency.get('graphData')

// The backend does not return continuous time data.. so we must fill in missing buckets to span full x-axis
export const getIncidentFrequencyFilledBuckets = createSelector(
  [
    _getIncidentFrequencyStart,
    _getIncidentFrequencyEnd,
    _getIncidentFrequencyResolutionType,
    _getIncidentFrequencyGraphData
  ],
  (requestStartDate, requestEndDate, resolutionType, graphData) => {
    if (!graphData || graphData.get('display_buckets').isEmpty()) return graphData.toJS()

    let filledGraphData = graphData.toJS()
    const segmentValues = filledGraphData.display_buckets[0].segments_and_values
    const zeroBucketPlaceholder = segmentValues.map((s) => {
      let clonedSegments = _clone(s)
      clonedSegments['bucket_total'] = 0
      return clonedSegments
    })

    function _fillMiddleBuckets (dataStart, zeroBucket) {
      let filledBuckets = []
      let dataEnd = null
      filledGraphData.display_buckets.forEach((bucket, index) => {
        if (index === filledGraphData.display_buckets.length - 1) {
          dataEnd = moment(bucket.bucket_start)
          filledBuckets.push(bucket)
        } else {
          // Fill Current
          filledBuckets.push(bucket)

          // Add blank until next date
          const current = moment(bucket.bucket_start)
          const next = moment(filledGraphData.display_buckets[index + 1].bucket_start)
          const dayBeforeNext = next.clone().subtract(1, 'day')
          let gapsToFill = !current.isSame(dayBeforeNext, resolutionType)

          if (gapsToFill) {
            while (gapsToFill) {
              filledBuckets.push({
                bucket_start: current.valueOf(),
                segments_and_values: zeroBucket
              })
              current.add(1, resolutionType)
              gapsToFill = !current.isSame(next, resolutionType)
            }
          }
        }
      })

      return [filledBuckets, dataEnd]
    }

    function _fillEdgeBuckets (dataStart, dataEnd, zeroBucket, filledBuckets) {
      const requestStart = moment(requestStartDate)
      const requestEnd = moment(requestEndDate)

      const needsFrontFilled = (requestStart, dataStart) => {
        return requestStart.isBefore(dataStart)
      }

      const needsBackFilled = (requestEnd, dataEnd) => {
        return requestEnd.isAfter(dataEnd.clone().add(1, resolutionType))
      }

      if (needsFrontFilled(requestStart, dataStart)) {
        while (needsFrontFilled(requestStart, dataStart)) {
          dataStart.subtract(1, resolutionType)
          filledBuckets.unshift({
            bucket_start: dataStart.valueOf(),
            segments_and_values: zeroBucket
          })
        }
      }
      if (needsBackFilled(requestEnd, dataEnd)) {
        while (needsBackFilled(requestEnd, dataEnd)) {
          dataEnd.add(1, resolutionType)
          filledBuckets.push({
            bucket_start: dataEnd.valueOf(),
            segments_and_values: zeroBucket
          })
        }
      }
      return filledBuckets
    }

    let dataStartDate = moment(filledGraphData.display_buckets[0].bucket_start)

    let [filledBucketData, dataEndDate] = _fillMiddleBuckets(dataStartDate, zeroBucketPlaceholder)
    filledBucketData = _fillEdgeBuckets(dataStartDate, dataEndDate, zeroBucketPlaceholder, filledBucketData)

    filledGraphData.display_buckets = filledBucketData
    return filledGraphData
  }
)
