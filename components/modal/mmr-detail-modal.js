import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  mttaMttrIncidentDetailGet
} from 'reporting/actions/mtta-mttr'

import moment from 'moment'

import {
  Icon,
  Table
} from '@victorops/victory'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faAngleRight,
  faAngleDown
} from '@fortawesome/fontawesome-pro-light'

import { unescape } from 'components/__utils/format'

function mapStateToProps (state) {
  return {
    incidentDetailData: state.mttaMttr.get('incidentDetailData'),
    data: state.mttaMttr.getIn(['table', 'data', 'incidents']),
    loadingDetailData: state.mttaMttr.get('loadingDetailData'),
    selectedTeam: state.mttaMttr.get('selectedTeam'),
    beginDate: state.mttaMttr.get('beginDate'),
    endDate: state.mttaMttr.get('endDate'),
    auth: state.auth
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getIncidentDetails: (payload) => dispatch(mttaMttrIncidentDetailGet(payload))
  }
}

class MmrIncidentDetailModal extends Component {
  componentDidMount () {
    const payload = { incidentNumber: this.props.incidentId }
    this.dateDetermined = false
    this.props.getIncidentDetails(payload)
  }

  _transmogText (transmog) {
    const orgslug = this.props.auth.config.get('orgslug', '')
    const transmogHref = `${location.origin}/dash/${orgslug}#/alert-rules`
    if (transmog) {
      return (
        <h2 className='heading-4 modal--transmog-detail--true'>
          <Icon type='Transmog' /> <span>This incident was transmogrified (<a target='_blank' href={transmogHref}>learn more</a>)</span>
        </h2>
      )
    } else {
      return (
        <h2 className='heading-4 modal--transmog-detail--false'>
          <Icon type='Transmog' /> <span>This incident was not transmogrified (<a target='_blank' href={transmogHref}>learn more</a>)</span>
        </h2>
      )
    }
  }

  _alertDetail (alertDetail, alertDetailKey) {
    return (
      <div className='row' key={alertDetailKey}>
        <div className='col-4'>
          {unescape(alertDetailKey)}
        </div>
        <div className='col-8'>
          {unescape(alertDetail)}
        </div>
      </div>
    )
  }

  _alertDetails (alertDetails) {
    let tableData = alertDetails.map(this._alertDetail).toArray()

    if (tableData.length === 0) {
      tableData = 'No additional details'
    }

    return (
      <form className='alert-details'>
        <input type='checkbox' id='alert-details--checkbox' className='alert-details--checkbox' />
        <label htmlFor='alert-details--checkbox' className='alert-details--label'>
          <div className='row'>
            <div className='angle--down pull-left' ><FontAwesomeIcon icon={faAngleRight} /></div>
            <div className='angle--right pull-left' ><FontAwesomeIcon icon={faAngleDown} /></div>
            <span className='padded-left'>alert details</span>
          </div>
        </label>
        <div className='alert-details--details'>
          <div className='alert-details-table'>
            {tableData}
          </div>
        </div>
      </form>
    )
  }

  _generateRowItems (data) {
    const formattedTitle = () =>
      <span>
        {moment(data.get(0)).format('MMM. DD, YYYY - h:mm')} {data.get(1)}
      </span>

    return {
      id: data.get(0) + data.get(1) + data.get(2),
      key: data.get(0) + data.get(1) + data.get(2),
      columns: [
        {type: 'component', component: formattedTitle, value: data.get(0)},
        {type: 'cell', content: data.get(2), value: data.get(2)}
      ]
    }
  }

  _table (timelineData) {
    const rowItems = timelineData.map(this._generateRowItems)
    const tableData = {
      index: 1,
      columnHeaders: [
        {label: 'Timeline', isSortable: true},
        {label: 'Who took action', isSortable: true}
      ],
      rowItems: rowItems ? rowItems.toJS() : []
    }

    return (
      <Table {...tableData} />
    )
  }

  _formatTimeSpacing (time) {
    while (time.length < 2) {
      time = '0' + time
    }
    return time
  }

  _transformTime (time) {
    const duration = moment.duration(time, 'seconds')
    const days = duration.days() ? `${duration.days()} day${duration.days() > 1 ? 's' : ''} ` : ''
    const hours = duration.hours() ? `${duration.hours()} hour${duration.hours() > 1 ? 's' : ''} ` : ''
    const minutes = duration.minutes() ? `${duration.minutes()} minute${duration.minutes() > 1 ? 's' : ''} ` : ''
    const seconds = duration.seconds() ? `${duration.seconds()} second${duration.seconds() > 1 ? 's' : ''} ` : ''
    return `${days}${hours}${minutes}${seconds}`
  }

  componentWillReceiveProps (nextProps) {
    const incidentDate = nextProps.incidentDetailData.get('date', false)
    if (incidentDate && !this.dateDetermined) {
      nextProps.updateModal(moment(incidentDate).format('MMM. DD, YYYY - h:mm A (Z UTC)'))
      this.dateDetermined = true
    }
  }

  render () {
    if (!this.props.loadingDetailData) {
      const incidentName = this.props.incidentDetailData.get('incident')
      const transmog = this.props.incidentDetailData.get('transmog', false)
      const timeToAck = this.props.incidentDetailData.get('time_to_ack', 0)
      const timeToRes = this.props.incidentDetailData.get('time_to_res', 0)
      const pages = this.props.incidentDetailData.get('pages', 0)
      const reroutes = this.props.incidentDetailData.get('reroutes', 0)

      const alertDetails = this.props.incidentDetailData.get('alert_details')
      const timeline = this.props.incidentDetailData.get('timeline')

      let CriticalityText = <span className='warning-color'>WARNING</span>
      if (alertDetails.get('message_type') === 'CRITICAL') {
        CriticalityText = <span className='critical-color'>CRITICAL</span>
      }

      return (
        <div className='mtta-mttr--incident-detail--modal'>
          <div className='modal-contents'>
            <div>
              <h2 className='heading-4'>{CriticalityText} incident {incidentName}</h2>

              <div className='modal--main-detail'>
                { this._transmogText(transmog) }
              </div>

              <div className='modal--main-detail'>
                { this._alertDetails(alertDetails) }
              </div>

              <p className='modal--main-detail'>
                <strong>Time to Acknowledge:</strong>
                <span> {this._transformTime(timeToAck)}</span>
              </p>

              <p className='modal--main-detail'>
                <strong>Time to Resolve:</strong>
                <span> {this._transformTime(timeToRes)}</span>
              </p>

              <p className='modal--main-detail'>
                <strong>Number of Pages:</strong>
                <span> {pages} pages</span>
              </p>

              <p className='modal--main-detail'>
                <strong>Number of Reroutes:</strong>
                <span> {reroutes} reroutes</span>
              </p>

              { this._table(timeline) }
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className='container'>
          <div className='row'>
            <div className='loading-random-strings'>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MmrIncidentDetailModal)
