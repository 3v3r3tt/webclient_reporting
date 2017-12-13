import React, {Component} from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'

import defaultHighChartsOptions from './highcharts-config'
import Placeholder from './placeholder'

import moment from 'moment'
import { fromJS } from 'immutable'
import {
  merge as _merge,
  clone as _clone
} from 'vendor/lodash'
import _truncate from 'util/truncate'

import {
  getIncidentFrequencyFilledBuckets
} from 'reporting/selectors'

import {
  incidentFrequencyTableReduce
} from 'reporting/actions/incident-frequency'

function mapStateToProps (state) {
  return {
    data: getIncidentFrequencyFilledBuckets(state),
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate'),
    chartType: state.incidentFrequency.get('chartType'),
    graphError: state.incidentFrequency.getIn(['error', 'graph']),
    resolutionType: state.incidentFrequency.get('resolutionType')
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
    const currentStartDate = moment(Number(bucket.bucket_start))
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
      return [0.4, dateBuckets.length - 1.4]
    }
  }

  _transformGraphData (generateGraph) {
    if (!this.props.data) return false
    let startDateBuckets = []
    let segmentSeriesData = []
    let lineDupeTracker = [{}]
    let graphYMax = 0
    this.props.data.display_buckets.forEach((bucket, outerIndex) => {
      const bucketLabel = this._determineBucketLabel(bucket)
      startDateBuckets.push(bucketLabel)
      lineDupeTracker.push({})
      let currentGraphYMax = 0

      bucket.segments_and_values.forEach((segment, index) => {
        const bucketTotal = segment.bucket_total
        const dupesNeedHandled = lineDupeTracker[outerIndex][bucketTotal] && this.props.chartType === 'Line'
        if (dupesNeedHandled) {
          lineDupeTracker[outerIndex][bucketTotal] = lineDupeTracker[outerIndex][bucketTotal] + 1
        } else if (this.props.chartType === 'Line') {
          lineDupeTracker[outerIndex][bucketTotal] = 1
        }

        const jitterAmount = dupesNeedHandled ? lineDupeTracker[outerIndex][bucketTotal] / 100 : 0
        if (outerIndex === 0) {
          segmentSeriesData[index] = {
            name: _truncate(segment.segment_name, 15) + ' ',
            data: [bucketTotal + jitterAmount]
          }
        } else {
          segmentSeriesData[index].data.push(bucketTotal + jitterAmount)
        }

        if (this.props.chartType === 'Area') {
          currentGraphYMax += bucketTotal
          graphYMax = graphYMax < currentGraphYMax ? currentGraphYMax : graphYMax
        } else {
          currentGraphYMax = bucketTotal
          graphYMax = graphYMax < currentGraphYMax ? currentGraphYMax : graphYMax
        }
      })
    })

    const [graphXMin, graphXMax] = this._determineGraphMinMax(startDateBuckets)

    var hoverCol = null

    const config = {
      colors: this.props.colorList,
      chart: {
        type: this.props.chartType.toLowerCase(),
        events: {
          click: function (e) {
            let chart = this.xAxis[0]
            chart.removePlotLine('selected-bucket')
            chart.addPlotLine({
              value: hoverCol.x,
              color: '#7e7e7e',
              width: 3,
              id: 'selected-bucket',
              zIndex: '9999'
            })
            chart.labelFormatter(hoverCol.x)
            generateGraph(hoverCol.category, hoverCol.series.chart.series, hoverCol.x)
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
        min: graphXMin,
        max: graphXMax,
        tickmarkPlacement: startDateBuckets.length === 1 ? 'on' : 'between'
      },
      yAxis: {
        title: {
          text: 'Number of Incidents'
        },
        max: graphYMax + 1
      },
      plotOptions: {
        series: {
          point: {
            events: {
              click: function (e) {
                let chart = this.series.chart.xAxis[0]
                chart.removePlotLine('selected-bucket')
                chart.addPlotLine({
                  value: hoverCol.x,
                  color: '#7e7e7e',
                  width: 3,
                  id: 'selected-bucket',
                  zIndex: '9999'
                })
                chart.labelFormatter(this.x)
                generateGraph(hoverCol.category, hoverCol.series.chart.series, hoverCol.x)
              },
              mouseOver: function (e) {
                hoverCol = this
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
    const plotLine = document.getElementsByClassName('highcharts-plot-lines-9999')[0]
    plotLine.style.display = 'unset'
    this.props.updateReducedTable({
      reducedRows: fromJS(reducedRows),
      animation: false,
      columnTitle: name,
      selectedBucket: pointIndex
    })
  }

  render () {
    if (this.props.graphError) {
      return (
        <h1 className='incident-frequency--graph--no-data'>
          Could not fetch data from server - reload to try again.
        </h1>
      )
    }

    const graphIsEmpty = !this.props.data || (this.props.data.segments != null && this.props.data.segments.length === 0)
    if (graphIsEmpty) {
      return (
        <Placeholder />
      )
    }

    const highchartData = this._transformGraphData(this._generateReducedGraph)

    return (
      <div className='incident-frequency--graph' id='incident-frequency-graph'>
        <ReactHighcharts config={highchartData} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyGraph)
