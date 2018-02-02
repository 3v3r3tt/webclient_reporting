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

function mapStateToProps (state) {
  return {
    incidentDetailData: state.mttaMttr.get('incidentDetailData'),
    data: state.mttaMttr.getIn(['table', 'data', 'incidents']),
    loadingDetailData: state.mttaMttr.get('loadingDetailData'),
    selectedTeam: state.mttaMttr.get('selectedTeam'),
    beginDate: state.mttaMttr.get('beginDate'),
    endDate: state.mttaMttr.get('endDate')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getIncidentDetails: (payload) => dispatch(mttaMttrIncidentDetailGet(payload))
  }
}

class MmrIncidentDetailModal extends Component {
  constructor (props) {
    super(props)

    this._getIncidentName = this._getIncidentName.bind(this)
  }

  componentDidMount () {
    const payload = { incidentNumber: this.props.incidentId }
    this.props.getIncidentDetails(payload)
  }

  _getIncidentName () {
    const alertDetails = this.props.incidentDetailData.get('alert_details')
    const name = alertDetails.get('entity_display_name') || alertDetails.get('SERVICEDESC') || alertDetails.get('entity_id') || null

    return name ? 'from ' + name : null
  }

  _transmogText (transmog) {
    if (transmog) {
      return <h2 className='heading-4 modal--transmog-detail--true'><Icon type='Transmog' /> This incident was transmogrified</h2>
    } else {
      return <h2 className='heading-4 modal--transmog-detail--false'><Icon type='Transmog' /> This incident was not transmogrified</h2>
    }
  }

  _alertDetail (alertDetail, alertDetailKey) {
    return (
      <div className='row' key={alertDetailKey}>
        <div className='col-4'>
          {alertDetailKey}
        </div>
        <div className='col-8'>
          {alertDetail}
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
      <div className='alert-details'>
        <input type='checkbox' id='alert-details--checkbox' className='alert-details--checkbox' />
        <label htmlFor='alert-details--checkbox' className='angle--down' ><FontAwesomeIcon icon={faAngleRight} /></label>
        <label htmlFor='alert-details--checkbox' className='angle--right' ><FontAwesomeIcon icon={faAngleDown} /></label>
        <label htmlFor='alert-details--checkbox' className='alert-details--label'> alert details</label>
        <div className='alert-details--details'>
          <div className='alert-details-table'>
            {tableData}
          </div>
        </div>
      </div>
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
    const duration = moment.duration(time, 'm')
    let hours = Math.floor(duration.asHours()).toString()
    let minutes = duration.minutes().toString()
    hours = this._formatTimeSpacing(hours)
    minutes = this._formatTimeSpacing(minutes)
    return hours + ':' + minutes
  }

  render () {
    if (!this.props.loadingDetailData) {
      const entityDisplayName = this._getIncidentName()

      const incidentTableData = this.props.data.find((x) => x.get('id') === this.props.incidentId)
      const incidentTime = moment(incidentTableData.get('date'))
      const transmog = incidentTableData.get('transmog', false)

      const timeToAck = incidentTableData.get('time_to_ack', 0)
      const timeToRes = incidentTableData.get('time_to_res', 0)

      const pages = incidentTableData.get('pages', 0)
      const reroutes = incidentTableData.get('reroutes', 0)

      const incidentDetailData = this.props.incidentDetailData
      const alertDetails = incidentDetailData.get('alert_details')
      const timeline = incidentDetailData.get('timeline')

      let CriticalityText = <span className='critical-color'>CRITICAL</span>
      if (alertDetails.get('NOTIFICATIONTYPE') === 'warning') {
        CriticalityText = <span className='warning-color'>WARNING</span>
      }

      return (
        <div className='container mtta-mttr--incident-detail--modal'>
          <h4 className='modal-subtitle'>{incidentTime.format('MMM. DD, YYYY - h:mm A (Z UTC)')}</h4>
          <div className='modal-contents'>
            <div>
              <h2 className='heading-4'>{CriticalityText} incident {entityDisplayName}</h2>

              { this._transmogText(transmog) }

              { this._alertDetails(alertDetails) }

              <p className='modal--main-detail'>
                <strong>Time to Awknowledge:</strong>
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
