import React, {Component} from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'
import Victory from '@victorops/victory'

import moment from 'moment'
import { fromJS } from 'immutable'

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
    reducedData: state.incidentFrequency.get('reducedData'),
    selectedBucket: state.incidentFrequency.getIn(['reducedData', 'selectedBucket']),
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate'),
    chartType: state.incidentFrequency.get('chartType'),
    segmentationType: state.incidentFrequency.get('segmentationType'),
    resolutionType: state.incidentFrequency.get('resolutionType')
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
  }

  _transformGraphData (rawData, generateGraph) {
    if (!rawData) return false
    rawData = rawData.toJS()

    let startDateBuckets = []
    let segmentSeriesData = []
    rawData.display_buckets.forEach((bucket, outerIndex) => {
      startDateBuckets.push(moment(Number(bucket.bucket_start_date)).format('MMM D'))
      bucket.segments_and_values.forEach((segment, index) => {
        if (outerIndex === 0) {
          segmentSeriesData[index] = {
            name: segment.segment_name,
            data: [segment.bucket_total]
          }
        } else {
          segmentSeriesData[index].data.push(segment.bucket_total)
        }
      })
    })

    const selectedBucket = this.props.selectedBucket
    return {
      colors: this.props.colorList,
      legend: { enabled: false },
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
        type: 'linear',
        gridLineWidth: 1,
        tickInterval: 1,
        tickColor: '#d6d6d6',
        tickmarkPlacement: 'on',
        crosshair: {
          width: 1,
          color: '#7e7e7e'
        },
        plotLines: [{
          color: 'black',
          width: 2,
          zIndex: 20,
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
        }
      },
      yAxis: {
        type: 'linear',
        title: {
          text: 'Number of Incidents'
        },
        gridLineWidth: 0
      },

      tooltip: {
        crosshairs: true,
        shared: true,
        backgroundColor: 'white',
        borderColor: '#7e7e7e'
      },

      plotOptions: {
        line: {
          enableMouseTracking: true,
          marker: {
            enabled: false
          },
          animation: this.props.reducedData.animation
        },

        area: {
          stacking: 'normal',
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
  }

  _generateReducedGraph (name, series, pointIndex) {
    const reducedRows = series.map((segment, index) => {
      return ({
        segment_name: segment.name,
        bucket_total: segment.yData[pointIndex]
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
    const highchartData = this._transformGraphData(this.props.data, this._generateReducedGraph)
    const GraphContent = highchartData
      ? <ReactHighcharts config={highchartData} />
      : <p>Loading Graph...</p>

    let buttonClass = 'btn btn-outline-warning incident-frequency--graph--button'
    const drawButton = this.props.reducedData.get('reducedRows') !== null

    return (
      <div className='incident-frequency--graph'>
        {GraphContent}

        <Button
          content='Reset'
          type={!drawButton ? buttonClass + ' display--none' : buttonClass}
          clickHandler={() => { this.props.resetReducedTable() }} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyGraph)
