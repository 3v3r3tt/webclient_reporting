import React, {Component} from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'

import defaultHighChartsOptions from './highcharts-config'

import {
  merge as _merge,
  clone as _clone
} from 'vendor/lodash'

import moment from 'moment'
import {
  List
} from 'immutable'

function mapStateToProps (state) {
  return {
    selectedTeam: state.mttaMttr.get('selectedTeam'),
    beginDate: state.mttaMttr.get('beginDate'),
    endDate: state.mttaMttr.get('endDate'),
    graphError: state.mttaMttr.getIn(['error', 'graph']),
    loadingData: state.mttaMttr.get('loadingGraphData'),
    resolutionType: state.mttaMttr.get('resolutionType'),
    mttaGoal: state.mttaMttr.getIn(['goals', 'mtta'], null),
    mttrGoal: state.mttaMttr.getIn(['goals', 'mttr'], null)
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

  _convertToHighchartFormat (values) {
    const highchartFormattedData = values.map((x) => {
      return {
        x: x[0],
        y: x[1] / 60,
        name: x[2]
      }
    })
    return highchartFormattedData
  }

  _generateMttaMttrHighchartConfig (graphData) {
    if (!graphData) return
    const ttaAverageData = this._convertSecondsToMinutes(graphData.get('tta_average', List()).toJS())
    const ttaData = this._convertToHighchartFormat(graphData.get('tta_values', List()).toJS())
    const ttrAverageData = this._convertSecondsToMinutes(graphData.get('ttr_average', List()).toJS())
    const ttrData = this._convertToHighchartFormat(graphData.get('ttr_values', List()).toJS())
    const incidentCountData = graphData.get('incident_count', List()).toJS()

    const mttaGoalPlotline = {
      id: 'mttaGoalPlotline',
      color: '#fdcf8c',
      dashStyle: 'ShortDash',
      value: this.props.mttaGoal,
      width: 2,
      zIndex: 4
    }

    const mttrGoalPlotline = {
      id: 'mttrGoalPlotline',
      color: '#66d6ee',
      dashStyle: 'ShortDash',
      value: this.props.mttrGoal,
      width: 2,
      zIndex: 4
    }

    const scatterTooltipFormatter = (type) => function () {
      const formattedDate = moment(this.x).format('MMM Do YYYY [at] h:mm a')
      const duration = moment.duration(this.y * 60 * 1000)
      const hours = duration.hours() ? `${duration.hours()} hour${duration.hours() > 1 ? 's' : ''} ` : ''
      const minutes = duration.minutes() ? `${duration.minutes()} minute${duration.minutes() > 1 ? 's' : ''} ` : ''
      const seconds = duration.seconds() ? `${duration.seconds()} second${duration.seconds() > 1 ? 's' : ''} ` : ''
      const formattedTime = `${hours}${minutes}${seconds}`

      return (
        `${formattedDate}<br/><b>${formattedTime}</b> to ${type}<br/>`
      )
    }

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
        },
        plotLines: [ mttaGoalPlotline, mttrGoalPlotline ]
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
          pointFormatter: scatterTooltipFormatter('acknowledge')
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
          pointFormatter: scatterTooltipFormatter('resolve')
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
      }, {
        // Series that mimics the plot line
        color: '#fdcf8c',
        name: 'MTTA Goal',
        showInLegend: this.props.mttaGoal !== null,
        dashStyle: 'shortdash',
        marker: {
          enabled: false
        },
        events: {
          // Event for showing/hiding plot line
          legendItemClick: function (e) {
            if (this.visible) {
              this.chart.yAxis[0].removePlotLine('mttaGoalPlotline')
            } else {
              this.chart.yAxis[0].addPlotLine(mttaGoalPlotline)
            }
          }
        }
      }, {
        // Series that mimics the plot line
        color: '#66d6ee',
        name: 'MTTR Goal',
        showInLegend: this.props.mttrGoal !== null,
        dashStyle: 'shortdash',
        marker: {
          enabled: false
        },
        events: {
          // Event for showing/hiding plot line
          legendItemClick: function (e) {
            if (this.visible) {
              this.chart.yAxis[0].removePlotLine('mttrGoalPlotline')
            } else {
              this.chart.yAxis[0].addPlotLine(mttrGoalPlotline)
            }
          }
        }
      }]
    }

    return _merge(_clone(defaultHighChartsOptions), _clone(config))
  }

  render () {
    const mttaMttrHighchartData = this._generateMttaMttrHighchartConfig(this.props.graphData)

    return (
      <div className='mtta-mttr--graph' id='mtta-mttr-graph'>
        <ReactHighcharts config={mttaMttrHighchartData} ref='chart' />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttrGraph)
