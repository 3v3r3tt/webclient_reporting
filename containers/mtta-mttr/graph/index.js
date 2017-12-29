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
        }
      },
      yAxis: {
        title: {
          text: 'Time (minutes)'
        }
      },
      series: [{
        name: 'Average Time to Ack',
        type: 'spline',
        color: '#E29E39',
        marker: {
          fillColor: '#E29E39',
          radius: 4,
          symbol: 'diamond'
        },
        data: ttaAverageData
      }, {
        name: 'Average Time to Resolve',
        type: 'spline',
        color: '#00A7CB',
        marker: {
          fillColor: '#00A7CB',
          radius: 4,
          symbol: 'diamond'
        },
        data: ttrAverageData
      }, {
        name: 'Time to Ack',
        type: 'scatter',
        marker: {
          fillColor: '#E29E39',
          radius: 2,
          symbol: 'circle'
        },
        data: ttaData
      },
      {
        name: 'Time to Resolve',
        type: 'scatter',
        marker: {
          fillColor: '#00A7CB',
          radius: 2,
          symbol: 'circle'
        },
        data: ttrData
      }, {
        name: 'Incident Occurances',
        type: 'column',
        color: '#CCD3DA',
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
