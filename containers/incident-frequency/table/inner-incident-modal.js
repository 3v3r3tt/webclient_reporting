import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  incidentFrequencyIncidentDetailGet
} from 'reporting/actions/incident-frequency'

import moment from 'moment'

function mapStateToProps (state) {
  return {
    incidentDetail: state.incidentFrequency.get('incidentDetailData')
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
      incidentNumber: 12345
    }
    this.props.getIncidentDetails(payload)
  }

  render () {
    const incident = this.props.incidentDetail
    if (incident) {
      const startTime = moment(incident.get('startTime')).format('MMM. DD, YYYY - h:mm A')

      return (
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <h5>{incident.get('entityDisplayName')}</h5>
            </div>
            <div className='col-12 margin-bottom-10'>
              {startTime}
            </div>

            <div className='col-4'>Host</div>
            <div className='col-8'>{incident.get('host')}</div>

            <div className='col-4'>Routing Key</div>
            <div className='col-8'>{incident.get('routingKey')}</div>

            <div className='col-4'>Paged Teams</div>
            <div className='col-8'>{incident.get('pagedTeams').join(', ')}</div>

            <div className='col-4'>Alert Count</div>
            <div className='col-8'>{incident.get('alertCount')}</div>
          </div>
        </div>
      )
    } else {
      return (
        <p>Loading incident data....</p>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InnerIncidentModal)
