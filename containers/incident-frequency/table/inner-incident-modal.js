import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  incidentFrequencyIncidentDetailGet
} from 'reporting/actions/incident-frequency'

import moment from 'moment'

function mapStateToProps (state) {
  return {
    incidentDetail: state.incidentFrequency.get('incidentDetailData'),
    loadingDetailData: state.incidentFrequency.get('loadingDetailData')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getIncidentDetails: (payload) => dispatch(incidentFrequencyIncidentDetailGet(payload))
  }
}

class InnerIncidentModal extends Component {
  componentDidMount () {
    const payload = {
      incidentNumber: 12345 // TODO: this should be made dynamic when API works
    }
    this.props.getIncidentDetails(payload)
  }

  render () {
    if (!this.props.loadingDetailData) {
      const incident = this.props.incidentDetail
      const transitions = incident.get('transitions')
      const startTime = moment(transitions.find((obj) => obj.get('name') === 'triggered').get('at'))
      const endTime = moment(transitions.find((obj) => obj.get('name') === 'resolved').get('at'))
      const incidentDuration = endTime.diff(startTime, 'minutes', true)

      return (
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <h5>{incident.get('entityDisplayName')}</h5>
            </div>
            <div className='col-12 margin-bottom-10'>
              {startTime.format('MMM. DD, YYYY - h:mm A')}
            </div>

            <div className='col-4'>Host</div>
            <div className='col-8'>{incident.get('host')}</div>

            <div className='col-4'>Service</div>
            <div className='col-8'>{incident.get('service')}</div>

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
