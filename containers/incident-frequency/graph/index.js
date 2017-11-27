import React, {Component} from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'
import Victory from '@victorops/victory'
import defaultHighChartsOptions from './highcharts-config'

import moment from 'moment'
import { fromJS } from 'immutable'
import {
  merge as _merge,
  clone as _clone
} from 'vendor/lodash'

import {
  incidentFrequencyTableReduce,
  incidentFrequencyTableReset
} from 'reporting/actions/incident-frequency'

const {
  Button
} = Victory

function mapStateToProps (state) {
  return {
    data: state.incidentFrequency.get('graphData'),
    graphDataSegments: state.incidentFrequency.getIn(['graphData', 'segments']),
    graphDisplayBuckets: state.incidentFrequency.getIn(['graphData', 'display_buckets']),
    reducedData: state.incidentFrequency.get('reducedData'),
    selectedBucket: state.incidentFrequency.getIn(['reducedData', 'selectedBucket']),
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate'),
    chartType: state.incidentFrequency.get('chartType'),
    resolutionType: state.incidentFrequency.get('resolutionType'),
    graphError: state.incidentFrequency.getIn(['error', 'graph'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateReducedTable: (payload) => dispatch(incidentFrequencyTableReduce(payload)),
    resetReducedTable: (payload) => dispatch(incidentFrequencyTableReset(payload))
  }
}

class IncidentFrequencyGraph extends Component {
  constructor (props) {
    super(props)

    this._transformGraphData = this._transformGraphData.bind(this)
    this._generateReducedGraph = this._generateReducedGraph.bind(this)
    this._determineBucketLabel = this._determineBucketLabel.bind(this)
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

  _transformGraphData (generateGraph) {
    if (!this.props.data) return false
    let startDateBuckets = []
    let segmentSeriesData = []
    this.props.graphDisplayBuckets.forEach((bucket, outerIndex) => {
      const bucketLabel = this._determineBucketLabel(bucket)
      startDateBuckets.push(bucketLabel)
      bucket.get('segments_and_values').forEach((segment, index) => {
        if (outerIndex === 0) {
          segmentSeriesData[index] = {
            name: segment.get('segment_name'),
            data: [segment.get('bucket_total')]
          }
        } else {
          segmentSeriesData[index].data.push(segment.get('bucket_total'))
        }
      })
    })

    const selectedBucket = this.props.selectedBucket

    const config = {
      colors: this.props.colorList,

      chart: {
        type: this.props.chartType.toLowerCase(),
        events: {
          click: function (e) {
            let chart = this
            let point = chart.series[0].searchPoint(chart.pointer.normalize(e))
            generateGraph(point.category, point.series.chart.series, point.x)
          }
        }
      },

      title: {
        text: 'Incident Frequency Report'
      },

      xAxis: {
        categories: startDateBuckets,
        plotLines: [{
          value: selectedBucket
        }],
        labels: {
          formatter: function () {
            if (selectedBucket === this.pos) {
              return `<span style="fill: black;">${this.value}</span>`
            } else {
              return `<span style="fill-opacity: .7;">${this.value}</span>`
            }
          }
        },
        min: startDateBuckets.length <= 2 ? null : 0.5,
        max: startDateBuckets.length <= 2 ? null : startDateBuckets.length - 1.5,
        tickmarkPlacement: startDateBuckets.length === 1 ? 'on' : 'between'
      },
      yAxis: {
        title: {
          text: 'Number of Incidents'
        }
      },

      plotOptions: {
        line: {
          animation: this.props.reducedData.animation
        },

        area: {
          animation: this.props.reducedData.animation
        },

        series: {
          point: {
            events: {
              click: function (e) {
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

    let buttonClass = 'btn btn-outline-warning incident-frequency--graph--button'
    const drawButton = this.props.reducedData.get('reducedRows') !== null

    const graphError = <div className='incident-frequency--error--graph'>Could not fetch data from server - reload to try again.</div>

    const graph =
      <div className='incident-frequency--graph'>
        {GraphContent}
        {graphIsEmpty ? <h1 className='incident-frequency--graph--no-data'>No data for this time period</h1> : null}
        <Button
          content='Reset'
          type={!drawButton ? buttonClass + ' display--none' : buttonClass}
          clickHandler={() => { this.props.resetReducedTable() }} />
      </div>

    return (this.props.graphError ? graphError : graph)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyGraph)
