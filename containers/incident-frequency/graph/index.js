import React, {Component} from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'

import defaultHighChartsOptions from './highcharts-config'
import Placeholder from './placeholder'

import moment from 'moment'
import { fromJS } from 'immutable'
import {
  merge as _merge,
  clone as _clone,
  uniq as _uniq
} from 'vendor/lodash'
import _truncate from 'util/truncate'

import {
  incidentFrequencyTableReduce
} from 'reporting/actions/incident-frequency'

function mapStateToProps (state) {
  return {
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate'),
    chartType: state.incidentFrequency.get('chartType'),
    graphError: state.incidentFrequency.getIn(['error', 'graph']),
    loadingData: state.incidentFrequency.get('loadingGraphData'),
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

  componentDidMount () {
    this._manageLoadingState(this.props.loadingData)
  }

  componentDidUpdate (nextProps) {
    if (nextProps.loadingData !== this.props.loadingData) {
      this._manageLoadingState(this.props.loadingData)
    }
  }

  _manageLoadingState (loadingData) {
    if (this.refs.chart) {
      let chart = this.refs.chart.getChart()
      if (loadingData) {
        chart.showLoading()
      } else {
        chart.hideLoading()
      }
    }
  }

  _determineBucketLabel (bucket) {
    const currentStartDate = moment(Number(bucket.bucket_start))
    let currentIncrement = this.props.resolutionType.get('type').charAt(0)
    let bucketLabel = currentStartDate.utc().format('MMM D')

    if (currentIncrement !== 'd') {
      currentIncrement = currentIncrement === 'm' ? 'M' : currentIncrement // Otherwise momentjs thinks millis
      const currentEndDate = currentStartDate.clone().add(1, currentIncrement).subtract(1, 'd')

      const isFirstBucket = this.props.data.display_buckets[0].bucket_start === currentStartDate.valueOf()
      const isLastBucket = this.props.data.display_buckets[this.props.data.display_buckets.length - 1].bucket_start === currentStartDate.valueOf()

      if (isFirstBucket) {
        let newStartDate = moment(this.props.beginDate).startOf('day')
        bucketLabel = `${newStartDate.utc().format('MMM D')} - ${currentEndDate.utc().format('MMM D')}`
      } else if (isLastBucket) {
        let newEndDate = moment(this.props.endDate).startOf('day')
        bucketLabel = `${currentStartDate.utc().format('MMM D')} - ${newEndDate.utc().format('MMM D')}`
      } else {
        bucketLabel = `${currentStartDate.utc().format('MMM D')} - ${currentEndDate.utc().format('MMM D')}`
      }
    }
    return bucketLabel
  }

  _determineGraphMinMax (dateBuckets) {
    if (dateBuckets.length <= 2 || this.props.chartType === 'Column' || this.props.chartType === 'Bar') {
      return [null, null]
    } else {
      return [0.4, dateBuckets.length - 1.4]
    }
  }

  _transformGraphData (generateGraph) {
    if (!this.props.data || !this.props.data.display_buckets || this.props.loadingData) return defaultHighChartsOptions

    let startDateBuckets = []
    let segmentSeriesData = []
    let lineDupeTracker = [{}]
    let graphYMax = 0

    // uniqBy is a hack because when there is only 2 data points, the data gets funny.
    let buckets = _uniq(this.props.data.display_buckets, function (e) {
      return e.bucket_start
    })

    buckets.forEach((bucket, outerIndex) => {
      const bucketLabel = this._determineBucketLabel(bucket)
      startDateBuckets.push(bucketLabel)
      lineDupeTracker.push({})
      let currentGraphYMax = 0

      bucket.segments_and_values.forEach((segment, index) => {
        const bucketTotal = segment.bucket_total
        const chartTypeNeedsJitter = this.props.chartType === 'Line' || this.props.chartType === 'Spline'
        const dupesNeedHandled = lineDupeTracker[outerIndex][bucketTotal] && chartTypeNeedsJitter
        if (dupesNeedHandled) {
          lineDupeTracker[outerIndex][bucketTotal] = lineDupeTracker[outerIndex][bucketTotal] + 1
        } else if (this.props.chartType === 'Line' || this.props.chartType === 'Spline') {
          lineDupeTracker[outerIndex][bucketTotal] = 1
        }

        const jitterAmount = dupesNeedHandled ? lineDupeTracker[outerIndex][bucketTotal] / 100 : 0
        if (outerIndex === 0) {
          segmentSeriesData[index] = {
            name: _truncate(segment.segment_name, 15) + ' ',
            data: [bucketTotal + jitterAmount],
            options: {
              fullName: segment.segment_name
            }
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
        segment_name: segment['options'].options.fullName,
        total_incidents: segment.yData[pointIndex]
      })
    })
    const plotLine = document.getElementsByClassName('highcharts-plot-lines-9999')[0]
    plotLine.style.display = 'unset'
    const [startLabel, endLabel] = name.split(' - ')
    const reducedStart = moment(startLabel, 'MMM D').valueOf()
    const reducedEnd = moment(endLabel, 'MMM D').valueOf() || moment(startLabel, 'MMM D').add(1, 'day').valueOf()
    this.props.updateReducedTable({
      reducedRows: fromJS(reducedRows),
      animation: false,
      columnTitle: name,
      selectedBucket: pointIndex,
      reducedStart: reducedStart,
      reducedEnd: reducedEnd
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

    if (this.props.graphIsEmpty) {
      return (
        <Placeholder />
      )
    }

    const highchartData = this._transformGraphData(this._generateReducedGraph)

    return (
      <div className='incident-frequency--graph' id='incident-frequency-graph'>
        <ReactHighcharts config={highchartData} ref='chart' />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyGraph)
