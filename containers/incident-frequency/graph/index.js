import React, {Component} from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'
import defaultHighChartsOptions from './highcharts-config'

import moment from 'moment'
import { fromJS } from 'immutable'
import {
  merge as _merge,
  clone as _clone
} from 'vendor/lodash'

import {
  incidentFrequencyTableReduce
} from 'reporting/actions/incident-frequency'

function mapStateToProps (state) {
  return {
    data: state.incidentFrequency.get('graphData'),
    graphDataSegments: state.incidentFrequency.getIn(['graphData', 'segments']),
    graphDisplayBuckets: state.incidentFrequency.getIn(['graphData', 'display_buckets']),
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate'),
    chartType: state.incidentFrequency.get('chartType'),
    graphError: state.incidentFrequency.getIn(['error', 'graph']),
    resolutionType: state.incidentFrequency.get('resolutionType'),
    needsReset: state.incidentFrequency.get('needsReset')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateReducedTable: (payload) => dispatch(incidentFrequencyTableReduce(payload))
  }
}

class IncidentFrequencyGraph extends Component {
  constructor (props) {
    super(props)

    this._transformGraphData = this._transformGraphData.bind(this)
    this._generateReducedGraph = this._generateReducedGraph.bind(this)
    this._determineBucketLabel = this._determineBucketLabel.bind(this)
    this._determineGraphMinMax = this._determineGraphMinMax.bind(this)
  }

  _determineBucketLabel (bucket) {
    const currentStartDate = moment(Number(bucket.get('bucket_start')))
    let currentIncrement = this.props.resolutionType.get('type').charAt(0)
    let bucketLabel = currentStartDate.format('MMM D')
    if (currentIncrement !== 'd') {
      currentIncrement = currentIncrement === 'm' ? 'M' : currentIncrement // Otherwise momentjs thinks millis
      const currentEndDate = currentStartDate.clone().add(1, currentIncrement).subtract(1, 'd')
      bucketLabel = `${currentStartDate.format('MMM D')} - ${currentEndDate.format('MMM D')}`
    }
    return bucketLabel
  }

  _determineGraphMinMax (dateBuckets) {
    if (dateBuckets.length <= 2 || this.props.chartType === 'Column') {
      return [null, null]
    } else {
      return [0.5, dateBuckets.length - 1.5]
    }
  }

  _transformGraphData (generateGraph) {
    if (!this.props.data) return false
    let startDateBuckets = []
    let segmentSeriesData = []
    let lineDupeTracker = [{}]
    this.props.graphDisplayBuckets.forEach((bucket, outerIndex) => {
      const bucketLabel = this._determineBucketLabel(bucket)
      startDateBuckets.push(bucketLabel)
      lineDupeTracker.push({})
      bucket.get('segments_and_values').forEach((segment, index) => {
        const bucketTotal = segment.get('bucket_total')
        const dupesNeedHandled = lineDupeTracker[outerIndex][bucketTotal] && this.props.chartType === 'Line'
        if (dupesNeedHandled) {
          lineDupeTracker[outerIndex][bucketTotal] = lineDupeTracker[outerIndex][bucketTotal] + 1
        } else if (this.props.chartType === 'Line') {
          lineDupeTracker[outerIndex][bucketTotal] = 1
        }

        const jitterAmount = dupesNeedHandled ? lineDupeTracker[outerIndex][bucketTotal] / 100 : 0
        if (outerIndex === 0) {
          segmentSeriesData[index] = {
            name: segment.get('segment_name'),
            data: [bucketTotal + jitterAmount]
          }
        } else {
          segmentSeriesData[index].data.push(bucketTotal + jitterAmount)
        }
      })
    })

    const [graphMin, graphMax] = this._determineGraphMinMax(startDateBuckets)

    const config = {
      colors: this.props.colorList,
      chart: {
        type: this.props.chartType.toLowerCase(),
        events: {
          click: function (e) {
            let point = this.series[0].searchPoint(this.pointer.normalize(e))
            let chart = this.xAxis[0]
            chart.removePlotLine('selected-bucket')
            chart.addPlotLine({
              value: point.x,
              color: '#7e7e7e',
              width: 3,
              id: 'selected-bucket',
              zIndex: '9999'
            })
            chart.labelFormatter(point.x)
            generateGraph(point.category, point.series.chart.series, point.x)
          },
          load: function (e) {
            let chart = this.xAxis[0]
            chart.removePlotLine('selected-bucket')
          }
        }
      },
      xAxis: {
        categories: startDateBuckets,
        labels: {
          formatter: function (selectedBucket) {
            return `<span style="fill: black; font-size: 14px;">${this.value}</span>`
          }
        },
        min: graphMin,
        max: graphMax,
        tickmarkPlacement: startDateBuckets.length === 1 ? 'on' : 'between'
      },
      yAxis: {
        title: {
          text: 'Number of Incidents'
        }
      },
      plotOptions: {
        series: {
          point: {
            events: {
              click: function (e) {
                let chart = this.series.chart.xAxis[0]
                chart.removePlotLine('selected-bucket')
                chart.addPlotLine({
                  value: this.x,
                  color: '#7e7e7e',
                  width: 3,
                  id: 'selected-bucket',
                  zIndex: '9999'
                })
                chart.labelFormatter(this.x)
                generateGraph(this.category, this.series.chart.series, this.x)
              }
            }
          }
        }
      },
      series: segmentSeriesData
    }

    return _merge(_clone(defaultHighChartsOptions), _clone(config))
  }

  _generateReducedGraph (name, series, pointIndex) {
    const reducedRows = series.map((segment, index) => {
      return ({
        segment_name: segment.name,
        total_incidents: segment.yData[pointIndex]
      })
    })
    this.props.updateReducedTable({
      reducedRows: fromJS(reducedRows),
      animation: false,
      columnTitle: name,
      selectedBucket: pointIndex
    })
  }

  render () {
    const highchartData = this._transformGraphData(this._generateReducedGraph)
    const graphIsEmpty = this.props.graphDataSegments != null && this.props.graphDataSegments.size === 0

    const GraphContent = highchartData
      ? <ReactHighcharts config={highchartData} />
      : <p>Loading Graph...</p>

    const graphError = <div className='incident-frequency--error--graph'>Could not fetch data from server - reload to try again.</div>

    const graph =
      <div className='incident-frequency--graph'>
        {GraphContent}
        {graphIsEmpty ? <h1 className='incident-frequency--graph--no-data'>No data for this time period</h1> : null}
      </div>

    return (this.props.graphError ? graphError : graph)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyGraph)
