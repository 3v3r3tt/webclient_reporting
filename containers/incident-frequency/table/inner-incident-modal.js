import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  incidentFrequencyIncidentDetailGet
} from 'reporting/actions/incident-frequency'

import moment from 'moment'

function mapStateToProps (state) {
  return {
    incidentDetailData: state.incidentFrequency.get('incidentDetailData'),
    loadingDetailData: state.incidentFrequency.get('loadingDetailData'),
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getIncidentDetails: (payload) => dispatch(incidentFrequencyIncidentDetailGet(payload))
  }
}

class InnerIncidentModal extends Component {
  componentDidMount () {
    const incidentId = Number(this.props.incidentName.match(/^\[(.*)\]/)[1])
    const payload = {
      incidentNumber: incidentId,
      teamSlug: this.props.selectedTeam,
      start: this.props.beginDate,
      end: this.props.endDate
    }
    this.props.getIncidentDetails(payload)
  }

  render () {
    if (!this.props.loadingDetailData) {
      const incident = this.props.incidentDetailData
      const startTime = moment(incident.get('startTime'))
      const endTime = moment(incident.get('lastAlertTime'))
      const incidentDuration = Math.round(endTime.diff(startTime, 'minutes', true))

      return (
        <div className='container incident-frequency--incident-detail--modal'>
          <div className='row margin-top-10'>
            <div className='col-4'>Start Time</div>
            <div className='col-8'>{startTime.format('MMM. DD, YYYY - h:mm A')}</div>

            <div className='col-4'>Host</div>
            <div className='col-8'>{incident.get('host')}</div>

            <div className='col-4'>Service</div>
            <div className='col-8'>{incident.get('service')}</div>

            <div className='col-4'>Integration</div>
            <div className='col-8'>{this.props.integration}</div>

            <div className='col-4'>Routing Key</div>
            <div className='col-8'>{incident.get('routingKey')}</div>

            <div className='col-4'>Paged Teams</div>
            <div className='col-8'>{incident.get('pagedTeams').join(', ')}</div>

            <div className='col-4'>Paged Users</div>
            <div className='col-8'>{incident.get('pagedUsers').join(', ')}</div>

            <div className='col-4'>Alert Count</div>
            <div className='col-8'>{incident.get('alertCount')}</div>

            <div className='col-4'>Duration</div>
            <div className='col-8'>{incidentDuration} minutes</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(InnerIncidentModal)
