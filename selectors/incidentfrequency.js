// vendor
import {
  createSelector
} from 'reselect'

import {
  clone as _clone
} from 'lodash'

import moment from 'moment-timezone'

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
