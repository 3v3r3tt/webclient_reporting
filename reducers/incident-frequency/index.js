import { fromJS as _fromJS } from 'immutable'

import moment from 'moment'
import { clone } from 'lodash'

import {
  INCIDENT_FREQUENCY_GRAPH_GET,
  INCIDENT_FREQUENCY_GRAPH_UPDATE,
  INCIDENT_FREQUENCY_GRAPH_ERROR,
  INCIDENT_FREQUENCY_TABLE_GET,
  INCIDENT_FREQUENCY_TABLE_UPDATE,
  INCIDENT_FREQUENCY_INNER_TABLE_RESET,
  INCIDENT_FREQUENCY_TABLE_ERROR,
  INCIDENT_FREQUENCY_FILTER_UPDATE,
  INCIDENT_FREQUENCY_TABLE_REDUCE,
  INCIDENT_FREQUENCY_TABLE_RESET,
  INCIDENT_FREQUENCY_INCIDENT_DETAIL_GET,
  INCIDENT_FREQUENCY_INCIDENT_DETAIL_UPDATE,
  INCIDENT_FREQUENCY_INCIDENT_DETAIL_ERROR
} from 'reporting/actions/incident-frequency'

export const initialState = _fromJS({
  loadingData: true,
  beginDate: moment().subtract(1, 'month').valueOf(),
  endDate: moment().valueOf(),
  timezoneOffset: moment().utcOffset() / 60,
  selectedTeam: '',
  chartType: 'Area',
  segmentationType: {
    name: 'Segment by service',
    key: 'service'
  },
  resolutionType: {
    name: 'Display weekly',
    type: 'week'
  },
  graphData: null,
  innerTableIncidentData: null,
  incidentDetailData: null,
  error: {
    graph: false,
    table: false
  },
  reducedData: {
    reducedRows: null,
    animation: true,
    columnTitle: null,
    selectedBucket: null
  },
  needsReset: false
})

export default function incidentFrequencyReport (state = initialState, action) {
  switch (action.type) {
    case INCIDENT_FREQUENCY_TABLE_GET:
    case INCIDENT_FREQUENCY_GRAPH_GET:
    case INCIDENT_FREQUENCY_INCIDENT_DETAIL_GET:
      return _loadingData(state)
    case INCIDENT_FREQUENCY_GRAPH_UPDATE:
      return _updateGraph(state, action.payload)
    case INCIDENT_FREQUENCY_TABLE_UPDATE:
      return _updateTable(state, action.payload)
    case INCIDENT_FREQUENCY_INNER_TABLE_RESET:
      return _resetInnerTable(state, action.payload)
    case INCIDENT_FREQUENCY_FILTER_UPDATE:
      return _filterUpdate(state, action.payload)
    case INCIDENT_FREQUENCY_GRAPH_ERROR:
      return _setIncidentFrequencyGraphError(state, action.payload)
    case INCIDENT_FREQUENCY_TABLE_ERROR:
      return _setIncidentFrequencyTableError(state, action.payload)
    case INCIDENT_FREQUENCY_TABLE_REDUCE:
      return _updateReducedTable(state, action.payload)
    case INCIDENT_FREQUENCY_TABLE_RESET:
      return _resetReducedTable(state, action.payload)
    case INCIDENT_FREQUENCY_INCIDENT_DETAIL_UPDATE:
      return _updateIncidentDetail(state, action.payload)
    case INCIDENT_FREQUENCY_INCIDENT_DETAIL_ERROR:
      return _setIncidentFrequencyIncidentDetailError(state, action.payload)
    default : return state
  }
}

const _loadingData = (state) => state.update('loadingData', () => true)

function _filterUpdate (state, payload) {
  const filterKey = Object.keys(payload)[0]
  return state.set(filterKey, payload[filterKey])
}

function _updateTable (state, payload) {
  return state.set('innerTableIncidentData', _fromJS(payload))
              .update('loadingData', () => false)
              .setIn(['error', 'table'], false)
}

function _resetInnerTable (state, payload) {
  return state.set('innerTableIncidentData', null)
              .update('loadingData', () => false)
              .setIn(['error', 'table'], false)
}

function _setIncidentFrequencyTableError (state, payload) {
  return state.setIn(['error', 'table'], _fromJS(payload.error))
}

function _updateGraph (state, payload) {
  const resolutionType = state.getIn(['resolutionType', 'type'])
  let filledBucketData = []
  const segmentValues = payload.display_buckets[0].segments_and_values
  const zeroBucketPlaceholder = segmentValues.map((s) => {
    let clonedSegments = clone(s)
    clonedSegments['bucket_total'] = 0
    return clonedSegments
  })

  payload.display_buckets.forEach((bucket, index) => {
    if (index === payload.display_buckets.length - 1) {
      filledBucketData.push(bucket)
    } else {
      const current = moment(bucket.bucket_start)
      const next = moment(payload.display_buckets[index + 1].bucket_start)
      const dayBeforeNext = next.clone().subtract(1, 'day')
      let gapsToFill = !current.isSame(dayBeforeNext, resolutionType)

      if (gapsToFill) {
        do {
          filledBucketData.push({
            bucket_start: current.valueOf(),
            segments_and_values: zeroBucketPlaceholder
          })
          current.add(1, resolutionType)
          gapsToFill = !current.isSame(next, resolutionType)
        } while (gapsToFill)
      } else {
        filledBucketData.push(bucket)
      }
    }
  })

  payload.display_buckets = filledBucketData

  return state.set('graphData', _fromJS(payload))
              .update('loadingData', () => false)
              .setIn(['error', 'graph'], false)
}

function _setIncidentFrequencyGraphError (state, payload) {
  return state.setIn(['error', 'graph'], _fromJS(payload.error))
}

function _updateReducedTable (state, payload) {
  return state.set('reducedData', _fromJS(payload))
}

function _resetReducedTable (state, payload) {
  const last = state.get('needsReset')
  return state.set('reducedData', _fromJS({
    reducedRows: null,
    animation: true,
    columnTitle: null,
    selectedBucket: null}))
              .set('needsReset', !last)
}

function _setIncidentFrequencyIncidentDetailError (state, payload) {
  return state.setIn(['error', 'modal'], _fromJS(payload.error))
}

function _updateIncidentDetail (state, payload) {
  return state.set('incidentDetailData', _fromJS(payload))
}
