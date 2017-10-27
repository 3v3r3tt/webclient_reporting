import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Victory from '@victorops/victory'

import moment from 'moment'

import Filter from './filter'
import Graph from './graph'

import {
  incidentFrequencyGraphGet,
  incidentFrequencyTableReduce,
  incidentFrequencyTableReset
} from 'reporting/actions/incident-frequency'

const {
  BreadCrumbs,
  Table
} = Victory

const config = window.VO_CONFIG

function mapStateToProps (state) {
  return {
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate'),
    data: state.incidentFrequency.get('graphData'),
    chartType: state.incidentFrequency.get('chartType'),
    segmentationType: state.incidentFrequency.get('segmentationType'),
    resolutionType: state.incidentFrequency.get('resolutionType'),
    reducedData: state.incidentFrequency.get('reducedData')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTeamIncidentFrequencyData: (payload) => dispatch(incidentFrequencyGraphGet(payload)),
    updateReducedTable: (payload) => dispatch(incidentFrequencyTableReduce(payload)),
    resetReducedTable: (payload) => dispatch(incidentFrequencyTableReset(payload))
  }
}

class IncidentFrequency extends Component {
  constructor (props) {
    super(props)

    this._transformGraphData = this._transformGraphData.bind(this)
    this.generateReducedGraph = this.generateReducedGraph.bind(this)
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

    return {
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
          animation: this.props.reducedData.get('animation')
        },

        area: {
          stacking: 'normal',
          animation: this.props.reducedData.get('animation')
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

  generateReducedGraph (name, series, pointIndex) {
    const generatedRows = series.map((segment, index) => {
      return ({
        id: segment.name,
        key: index,
        columns: [{
          content: segment.name,
          value: segment.name,
          id: 'name',
          type: 'cell'
        },
        {
          content: segment.yData[pointIndex],
          value: segment.yData[pointIndex],
          id: 'total',
          type: 'cell'
        }]
      })
    })
    this.props.updateReducedTable({
      reducedRows: generatedRows,
      animation: false,
      columnTitle: name
    })
  }

  _generateIncidentFrequencyTableRows (incidentFrequencyData) {
    if (!incidentFrequencyData) return []
    const generatedRows = incidentFrequencyData.get('segments').map((segment, index) => {
      return ({
        id: segment.get('segment_name'),
        key: index,
        columns: [{
          content: segment.get('segment_name'),
          value: segment.get('segment_name'),
          id: 'name',
          type: 'cell'
        },
        {
          content: segment.get('bucket_total'),
          value: segment.get('bucket_total'),
          id: 'total',
          type: 'cell'
        }]
      })
    })
    return generatedRows.toJS()
  }

  _determineResolutionMomentType (label) {
    switch (label) {
      case 'Display daily': return 'day'
      case 'Display weekly': return 'week'
      case 'Display monthly': return 'month'
      default: throw new Error('Unexpected date resolution type!')
    }
  }

  _determineDateRangeLabel (columnTitle) {
    const clickDate = moment(columnTitle, 'MMM D').date()
    const clickMonth = moment(columnTitle, 'MMM D').month()
    const clickYear = moment().month() > clickMonth ? moment().year() : moment().year() - 1
    const fromDate = moment(new Date(clickYear, clickMonth, clickDate))
    const dateResolution = this._determineResolutionMomentType(this.props.resolutionType)
    const toDate = fromDate.clone().add(1, dateResolution)
    return `# of Incidents (${fromDate.format('MMM D')} - ${toDate.format('MMM D')})`
  }

  render () {
    const ReportHomeLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>
    const generatedRows = this._generateIncidentFrequencyTableRows(this.props.data)

    const columnTitle = this.props.reducedData.get('columnTitle')
    let incidentColumnLabel = '# of Incidents'
    if (columnTitle) {
      incidentColumnLabel = this._determineDateRangeLabel(columnTitle)
    }

    const incidentFrequencyTableConfig = {
      columnHeaders: [
        {
          label: 'Service',
          isSortable: true
        },
        {
          label: incidentColumnLabel,
          isSortable: true
        }],
      columnWidths: ['70%', '30%'],
      rowItems: this.props.reducedData.get('reducedRows') ? this.props.reducedData.get('reducedRows').toJS() : generatedRows
    }

    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportHomeLink, active: true},
          {label: 'Incident Frequency', uri: '#reports/incident-frequcy', active: true}
        ]} light />

        <h1 className='heading-3'>Incident Frequency Report</h1>

        <Filter
          beginDate={this.props.beginDate}
          endDate={this.props.endDate}
          selectedUser={null}
          selectedTeam={this.props.selectedTeam}
          chartType={this.props.chartType}
          segmentationType={this.props.segmentationType}
          resolutionType={this.props.resolutionType}
          getData={this.props.getTeamIncidentFrequencyData}
        />

        <Graph
          data={this._transformGraphData(this.props.data, this.generateReducedGraph)}
          reset={this.props.resetReducedTable}
          drawButton={this.props.reducedData.get('reducedRows') !== null} />

        <div className='has-loading-gradient margin-top-10'>
          <Table {...incidentFrequencyTableConfig} showLoader={this.props.isLoading} />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequency)
