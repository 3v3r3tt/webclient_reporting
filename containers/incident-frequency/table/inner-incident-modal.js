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
  constructor (props) {
    super(props)

    this._getIncidentName = this._getIncidentName.bind(this)
  }

  componentDidMount () {
    const payload = {
      incidentNumber: this.props.incidentId,
      teamSlug: this.props.selectedTeam,
      start: this.props.beginDate,
      end: this.props.endDate
    }
    this.props.getIncidentDetails(payload)
  }

  _getIncidentName () {
    if (this.props.incidentDetailData.get('entityDisplayName')) {
      return this.props.incidentDetailData.get('entityDisplayName')
    } else if (this.props.incidentDetailData.get('service')) {
      return this.props.incidentDetailData.get('service')
    } else {
      return this.props.incidentDetailData.get('entityId')
    }
  }

  render () {
    if (!this.props.loadingDetailData) {
      const incident = this.props.incidentDetailData
      const startTime = moment(incident.get('startTime'))
      const endTime = moment(incident.get('lastAlertTime'))
      const incidentDuration = Math.round(endTime.diff(startTime, 'minutes', true))
      const entityDisplayName = this._getIncidentName()

      return (
        <div className='container incident-frequency--incident-detail--modal'>
          <div>
            <h2 className='heading-4'>Incident from {entityDisplayName}</h2>
            <h4 className='heading-6'>{startTime.format('MMM. DD, YYYY - h:mm A (Z UTC)')}</h4>

            <h3 className='heading-5'>Integration</h3>
            <p>{this.props.integration}</p>

            <h3 className='heading-5'>Host</h3>
            <p>{incident.get('host') || 'No host provided'}</p>

            <h3 className='heading-5'>Service</h3>
            <p>{incident.get('service')}</p>

            <h3 className='heading-5'>Alert details (from first alert)</h3>
            <div className='alert-details-table'>
              <div className='row'>
                <div className='col-4'>
                  First alert
                </div>
                <div className='col-8'>
                  {startTime.format('MMM. DD, YYYY - h:mm A (Z UTC)')}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Last alert
                </div>
                <div className='col-8'>
                  {endTime.format('MMM. DD, YYYY - h:mm A (Z UTC)')}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Duration
                </div>
                <div className='col-8'>
                  {incidentDuration} minute{incidentDuration !== 1 ? 's' : ''}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Alert count
                </div>
                <div className='col-8'>
                  {incident.get('alertCount')}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Routing key
                </div>
                <div className='col-8'>
                  {incident.get('routingKey')}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Paged teams
                </div>
                <div className='col-8'>
                  {incident.get('pagedTeams').join(', ')}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Paged users
                </div>
                <div className='col-8'>
                  {incident.get('pagedUsers').join(', ')}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Entity name
                </div>
                <div className='col-8'>
                  {incident.get('entityDisplayName')}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Entity id
                </div>
                <div className='col-8'>
                  {incident.get('entityId')}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Entity type
                </div>
                <div className='col-8'>
                  {incident.get('entityType')}
                </div>
              </div>
              <div className='row'>
                <div className='col-4'>
                  Transitions
                </div>
                <div className='col-8'>
                  {incident.get('transitions').join(', ')}
                </div>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(InnerIncidentModal)
