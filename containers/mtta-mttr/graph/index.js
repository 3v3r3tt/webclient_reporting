import React, {Component} from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'
import HighchartsNoData from 'highcharts/modules/no-data-to-display.js'

import MmrIncidentDetailModal from 'reporting/components/modal/mmr-detail-modal'
import defaultHighChartsOptions from './highcharts-config'

import {
  merge as _merge,
  clone as _clone
} from 'vendor/lodash'

import moment from 'moment'
import {
  List
} from 'immutable'

import {
  mttaMttrGoalUpdateMtta,
  mttaMttrGoalUpdateMttr
} from 'reporting/actions/mtta-mttr'

import {
  hideModal,
  showModal
} from 'reporting/actions/modal'

import meta from 'util/meta'
import when from 'when'

function mapStateToProps (state) {
  return {
    selectedTeam: state.mttaMttr.get('selectedTeam'),
    beginDate: state.mttaMttr.get('beginDate'),
    endDate: state.mttaMttr.get('endDate'),
    graphError: state.mttaMttr.getIn(['error', 'graph']),
    loadingData: state.mttaMttr.get('loadingGraphData'),
    resolutionType: state.mttaMttr.get('resolutionType'),
    yAxisType: state.mttaMttr.get('yAxisType'),
    mttaGoal: state.mttaMttr.getIn(['goals', 'mtta'], null),
    mttrGoal: state.mttaMttr.getIn(['goals', 'mttr'], null),
    tableData: state.mttaMttr.getIn(['table', 'data', 'incidents'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updateMttaGoal: (payload) => dispatch(mttaMttrGoalUpdateMtta(payload)),
    updateMttrGoal: (payload) => dispatch(mttaMttrGoalUpdateMttr(payload)),
    hideModal: (payload) => dispatch(hideModal(payload)),
    showModal: (payload) => dispatch(showModal(payload))
  }
}

class MttaMttrGraph extends Component {
  constructor (props) {
    super(props)

    this._generateMttaMttrHighchartConfig = this._generateMttaMttrHighchartConfig.bind(this)
    this._manageGoals = this._manageGoals.bind(this)
    this._openIncidentDetailModal = this._openIncidentDetailModal.bind(this)
    this._updateModal = this._updateModal.bind(this)
  }

  componentDidMount () {
    this._manageLoadingState(this.props.loadingData)
    this._manageGoals()
  }

  componentDidUpdate (nextProps) {
    if (nextProps.loadingData !== this.props.loadingData) {
      this._manageLoadingState(this.props.loadingData)
    }
  }

  _manageGoals () {
    when(meta.getUserMeta())
      .then((userMeta) => {
        if (userMeta['mmr:goal:mtta']) this.props.updateMttaGoal({mtta: userMeta['mmr:goal:mtta']})
        if (userMeta['mmr:goal:mttr']) this.props.updateMttrGoal({mttr: userMeta['mmr:goal:mttr']})
      })
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

  _convertToHighchartFormat (values) {
    const highchartFormattedData = values.map((x) => {
      return {
        x: x[0],
        incidentStart: x[1],
        y: x[2],
        name: x[3]
      }
    })
    return highchartFormattedData
  }

  _scatterTooltipFormatter (type) {
    return function () {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1)
      const formattedIncidentDate = moment(this.x).format('MMM Do YYYY [at] h:mm a')
      const formattedIncidentStartDate = moment(this.incidentStart).format('MMM Do YYYY [at] h:mm a')
      const duration = moment.duration(this.y, 'seconds')
      const days = duration.days() ? `${duration.days()} day${duration.days() > 1 ? 's' : ''} ` : ''
      const hours = duration.hours() ? `${duration.hours()} hour${duration.hours() > 1 ? 's' : ''} ` : ''
      const minutes = duration.minutes() ? `${duration.minutes()} minute${duration.minutes() > 1 ? 's' : ''} ` : ''
      const seconds = duration.seconds() ? `${duration.seconds()} second${duration.seconds() > 1 ? 's' : ''} ` : ''
      const formattedTime = `${days}${hours}${minutes}${seconds}`

      return (
        `Start date: ${formattedIncidentStartDate}<br/>${capitalizedType} date: ${formattedIncidentDate}<br/><b>${formattedTime}</b> to ${type}<br/>`
      )
    }
  }

  _lineTooltipFormatter () {
    return function () {
      const duration = moment.duration(this.y, 'seconds')
      return (
        `<span style="color:${this.color}">\u25CF</span> Average ${this.series.name}: <b>${duration.humanize()}</b><br/>`
      )
    }
  }

  _openIncidentDetailModal (incidentId) {
    const modalTitle = `Incident #${incidentId}`
    const modalComponent = <MmrIncidentDetailModal updateModal={this._updateModal} incidentId={Number(incidentId)} />

    this.modalConfig = {
      modalType: 'confirm',
      modalProps: {
        title: modalTitle,
        component: modalComponent,
        onCancel: () => this.props.hideModal(),
        modalClass: 'mtta-mttr--incident-detail--modal modal-is-scrollable',
        actionBar: false
      }
    }
    this.props.showModal(this.modalConfig)
  }

  _updateModal (formattedDate) {
    this.modalConfig.modalProps.subTitle = formattedDate
    this.props.showModal(this.modalConfig)
  }

  _setStartEndAnchors (ttData) {
    const startAnchor = moment(this.props.beginDate)
    const endAnchor = moment(this.props.endDate)
    const resolutionType = this.props.resolutionType.get('type')
    if (resolutionType !== 'day') {
      startAnchor.startOf(resolutionType).startOf('day')
      endAnchor.endOf(resolutionType).endOf('day')
    }
    ttData.unshift({
      x: startAnchor.valueOf(),
      y: null
    })
    ttData.push({
      x: endAnchor.valueOf(),
      y: null
    })
    return ttData
  }

  _generateMttaMttrHighchartConfig (graphData) {
    if (!graphData) return {}
    const ttaAverageData = graphData.get('tta_avg', List()).toJS()
    const ttaData = this._convertToHighchartFormat(graphData.get('tta_values', List()).toJS())
    const ttrAverageData = graphData.get('ttr_avg', List()).toJS()
    const ttrData = this._convertToHighchartFormat(graphData.get('ttr_values', List()).toJS())
    const incidentCountData = graphData.get('incident_count', List()).toJS()
    const resolutionType = this.props.resolutionType.get('type')

    const anchoredTtrData = this._setStartEndAnchors(ttrData)
    const anchoredTtaData = this._setStartEndAnchors(ttaData)

    const mttaGoalPlotline = {
      id: 'mttaGoalPlotline',
      color: '#fdcf8c',
      dashStyle: 'dashdot',
      value: this.props.mttaGoal ? moment.duration(this.props.mttaGoal).asSeconds() : null,
      width: 2,
      zIndex: 4
    }

    const mttrGoalPlotline = {
      id: 'mttrGoalPlotline',
      color: '#66d6ee',
      dashStyle: 'dash',
      value: this.props.mttrGoal ? moment.duration(this.props.mttrGoal).asSeconds() : null,
      width: 2,
      zIndex: 4
    }

    const xAxisNoCrosshair = {
      visible: false,
      type: 'datetime'
    }
    const xAxisWithCrosshair = {
      tickInterval: this.props.resolutionType.type === 'day' ? 24 * 3600 * 1000 : null,
      labels: {
        formatter: function () {
          const start = moment(this.value).add(1, 'day')
          switch (resolutionType) {
            case 'week':
              return `${start.format('MMM D')} - ${moment(this.value).add(1, 'week').format('MMM D')}`
            case 'month':
              return `${start.format('MMM')}`
            default:
              return start.format('MMM D')
          }
        }
      },
      title: {
        text: 'Date'
      },
      tickColor: '#d6d6d6',
      type: 'datetime',
      dateTimeLabelFormats: {
        hour: '<br />',
        day: '%b %e',
        week: '%b %e, %Y',
        month: '%b %Y'
      },
      crosshair: {
        width: 1,
        color: '#7e7e7e'
      }
    }

    const isLinear = this.props.yAxisType.get('type') === 'linear'
    const _openIncidentDetailModal = this._openIncidentDetailModal

    const config = {
      xAxis: [xAxisWithCrosshair, xAxisNoCrosshair],
      yAxis: [{
        title: {
          text: 'Time'
        },
        type: this.props.yAxisType.get('type'),
        plotLines: [ mttaGoalPlotline, mttrGoalPlotline ],
        gridLineWidth: 1,
        minorGridLineWidth: 0,
        labels: {
          formatter: function () {
            const reconfiguredMoment = _clone(moment)
            reconfiguredMoment.updateLocale('en', {
              relativeTime: {
                s: '%d seconds',
                m: '%d minute',
                h: '%d hour',
                d: '%d day'
              }
            })
            reconfiguredMoment.relativeTimeThreshold('s', 59)
            reconfiguredMoment.relativeTimeThreshold('m', 59)
            reconfiguredMoment.relativeTimeThreshold('h', 23)
            reconfiguredMoment.relativeTimeRounding((value) => {
              const roundedValue = Math.round(10 * value) / 10
              return roundedValue.toFixed(1)
            })
            const timeLabel = reconfiguredMoment.duration(this.value, 'seconds').humanize()
            if (timeLabel === '0.0 seconds') return ''
            return timeLabel
          }
        }
      }, {
        title: {
          text: 'Number of Incidents'
        },
        opposite: true,
        allowDecimals: false,
        gridLineWidth: isLinear ? 1 : 0,
        minorGridLineWidth: 0
      }],
      series: [{
        name: 'Time to Acknowledge',
        id: 'averageAckTime',
        type: 'spline',
        color: '#E29E39',
        zIndex: 3,
        tooltip: {
          pointFormatter: this._lineTooltipFormatter()
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
          pointFormatter: this._lineTooltipFormatter()
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
        turboThreshold: 0,
        xAxis: 1,
        zIndex: 2,
        tooltip: {
          pointFormatter: this._scatterTooltipFormatter('acknowledge'),
          headerFormat: '<span style="font-size: 14px; text-decoration: underline; font-weight: bold;">Incident {point.key}</span><br/>'
        },
        marker: {
          fillColor: 'rgba(226, 158, 57, 0.5)',
          radius: 3,
          symbol: 'circle'
        },
        data: anchoredTtaData,
        cursor: 'pointer',
        events: {
          click: function (e) {
            if (e.point.name.match(/^\[(\d*)\]/) && e.point.name.match(/^\[(\d*)\]/)[1]) {
              const incidentId = Number(e.point.name.match(/^\[(\d*)\]/)[1])
              _openIncidentDetailModal(incidentId)
            }
          }
        }
      },
      {
        name: 'Time to Resolve',
        id: 'resolveTimes',
        linkedTo: 'averageResolveTime',
        type: 'scatter',
        turboThreshold: 0,
        xAxis: 1,
        zIndex: 2,
        tooltip: {
          pointFormatter: this._scatterTooltipFormatter('resolve'),
          headerFormat: '<span style="font-size: 14px; text-decoration: underline; font-weight: bold;">Incident {point.key}</span><br/>'
        },
        marker: {
          fillColor: 'rgba(0, 167, 203, 0.5)',
          radius: 3,
          symbol: 'circle'
        },
        data: anchoredTtrData,
        cursor: 'pointer',
        events: {
          click: function (e) {
            const incidentId = Number(e.point.name.match(/^\[(\d*)\]/)[1])
            _openIncidentDetailModal(incidentId)
          }
        }
      }, {
        name: 'Number of Incidents',
        id: 'numberOfIncidents',
        type: 'column',
        zIndex: 1,
        color: 'rgba(204, 211, 218, 0.5)',
        pointPadding: 0,
        yAxis: 1,
        data: incidentCountData,
        findNearestPointBy: 'xy',
        events: {
          legendItemClick: function () {
            if (this.visible) {
              this.yAxis.setTitle({text: ''})
            } else {
              this.yAxis.setTitle({text: 'Number of Incidents'})
            }
          }
        }
      }, {
        name: 'MTTA Goal',
        color: '#fdcf8c',
        showInLegend: this.props.mttaGoal !== null,
        yAxis: 0,
        marker: {
          enabled: false
        },
        events: {
          legendItemClick: function (e) {
            if (this.visible) {
              this.chart.yAxis[0].removePlotLine('mttaGoalPlotline')
            } else {
              this.chart.yAxis[0].addPlotLine(mttaGoalPlotline)
            }
          }
        },
        data: [{
          x: moment(this.props.beginDate).valueOf(),
          y: this.props.mttaGoal / 1000
        }]
      }, {
        name: 'MTTR Goal',
        color: '#66d6ee',
        showInLegend: this.props.mttrGoal !== null,
        yAxis: 0,
        marker: {
          enabled: false
        },
        events: {
          legendItemClick: function (e) {
            if (this.visible) {
              this.chart.yAxis[0].removePlotLine('mttrGoalPlotline')
            } else {
              this.chart.yAxis[0].addPlotLine(mttrGoalPlotline)
            }
          }
        },
        data: [{
          x: moment(this.props.beginDate).valueOf(),
          y: this.props.mttrGoal / 1000
        }]
      }]
    }

    return _merge(_clone(defaultHighChartsOptions), _clone(config))
  }

  _checkForNoData () {
    const graphData = this.props.graphData

    return graphData.size && (!graphData.get('incident_count').size && !graphData.get('ttr_values').size && !graphData.get('ttr_values').size)
  }

  _setErrorText () {
    let noDataText = 'An error has occured, please try again.'
    let HasError = true

    const HighCharts = ReactHighcharts.Highcharts
    const graphData = this.props.graphData

    if (this.props.graphError) {
      noDataText = 'Sorry, something went wrong. Please try again.'
    } else if (this._checkForNoData()) {
      noDataText = 'There is no data to display.'
    } else if (!graphData.get('has_data_flag')) {
      noDataText = 'This Organization does not have any data.'
    } else {
      HasError = false
    }
    HighCharts.setOptions({lang: {noData: noDataText}})

    return HasError
  }

  render () {
    HighchartsNoData(ReactHighcharts.Highcharts)
    const mttaMttrHighchartData = this._generateMttaMttrHighchartConfig(this.props.graphData)
    let highChartsData = (this._setErrorText()) ? {} : mttaMttrHighchartData

    return (
      <div className='mtta-mttr--graph' id='mtta-mttr-graph'>
        <ReactHighcharts config={highChartsData} ref='chart' />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttrGraph)
