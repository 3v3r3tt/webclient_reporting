import React, {Component} from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'

import defaultHighChartsOptions from './highcharts-config'

import {
  merge as _merge,
  clone as _clone
} from 'vendor/lodash'

// import moment from 'moment'
import {
  List
} from 'immutable'

function mapStateToProps (state) {
  return {
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate'),
    graphError: state.incidentFrequency.getIn(['error', 'graph']),
    loadingData: state.incidentFrequency.get('loadingGraphData'),
    resolutionType: state.incidentFrequency.get('resolutionType')
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

class MttaMttrGraph extends Component {
  constructor (props) {
    super(props)

    this._generateMttaMttrHighchartConfig = this._generateMttaMttrHighchartConfig.bind(this)
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

  _convertSecondsToMinutes (secondsData) {
    return secondsData.map((x) => [x[0], x[1] / 60])
  }

  _generateMttaMttrHighchartConfig (graphData) {
    if (!graphData) return
    const ttaAverageData = this._convertSecondsToMinutes(graphData.get('tta_average', List()).toJS())
    const ttaData = this._convertSecondsToMinutes(graphData.get('tta_values', List()).toJS())
    const ttrAverageData = this._convertSecondsToMinutes(graphData.get('ttr_average', List()).toJS())
    const ttrData = this._convertSecondsToMinutes(graphData.get('ttr_values', List()).toJS())
    const incidentCountData = graphData.get('incident_count', List()).toJS()

    const config = {
      legend: {
        align: 'right',
        verticalAlign: 'top'
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          hour: '<br />',
          day: '%b %e',
          week: '%b %e, %Y',
          month: '%b %Y'
        },
        title: {
          text: 'Date'
        },
        tickPositioner: function (min, max) {
          let ticks = this.series[0].processedXData.slice()
          ticks.info = this.tickPositions.info
          return ticks
        }
      },
      yAxis: [{
        title: {
          text: 'Time (minutes)'
        }
      }, {
        title: {
          text: 'Incident Occurances'
        },
        opposite: true,
        allowDecimals: false
      }],
      tooltip: {
        shared: true,
        headerFormat: '<span style="font-size: 14px; text-decoration: underline; font-weight: bold;">{point.key}</span><br/>'
      },
      series: [{
        name: 'Time to Acknowledge',
        id: 'averageAckTime',
        type: 'spline',
        color: '#E29E39',
        zIndex: 3,
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25CF</span> Average {series.name}: <b>{point.y}</b> minutes<br/>'
        },
        marker: {
          fillColor: '#E29E39',
          radius: 4,
          symbol: 'diamond'
        },
        data: ttaAverageData
      }, {
        name: 'Time to Resolve',
        id: 'averageResolveTime',
        type: 'spline',
        color: '#00A7CB',
        zIndex: 3,
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25CF</span> Average {series.name}: <b>{point.y}</b> minutes<br/>'
        },
        marker: {
          fillColor: '#00A7CB',
          radius: 4,
          symbol: 'diamond'
        },
        data: ttrAverageData
      }, {
        name: 'Time to Acknowledge',
        id: 'ackTimes',
        linkedTo: 'averageAckTime',
        type: 'scatter',
        zIndex: 2,
        tooltip: {
          pointFormat: '<b>{point.y}</b> minutes to Acknowledge<br/>'
        },
        marker: {
          fillColor: 'rgba(226, 158, 57, 0.75)',
          radius: 3,
          symbol: 'circle'
        },
        data: ttaData
      },
      {
        name: 'Time to Resolve',
        id: 'resolveTimes',
        linkedTo: 'averageResolveTime',
        type: 'scatter',
        zIndex: 2,
        tooltip: {
          pointFormat: '<b>{point.y}</b> minutes to Resolve<br/>'
        },
        marker: {
          fillColor: 'rgba(0, 167, 203, 0.75)',
          radius: 3,
          symbol: 'circle'
        },
        data: ttrData
      }, {
        name: 'Incident Occurances',
        id: 'incidentOccurances',
        type: 'column',
        zIndex: 1,
        color: 'rgba(204, 211, 218, 0.5)',
        pointPadding: 0,
        yAxis: 1,
        data: incidentCountData
      }]
    }

    return _merge(_clone(defaultHighChartsOptions), _clone(config))
  }

  render () {
    const mttaMttrHighchartData = this._generateMttaMttrHighchartConfig(this.props.graphData)
    console.log('GRAPH: mttaMttrHighchartData: ', mttaMttrHighchartData)

    return (
      <div className='mtta-mttr--graph' id='mtta-mttr-graph'>
        <ReactHighcharts config={mttaMttrHighchartData} ref='chart' />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttrGraph)
