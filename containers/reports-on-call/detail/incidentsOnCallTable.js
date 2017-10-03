import React from 'react'

import moment from 'moment'

import OnCallDownloadCSVRow from './OnCallDownloadCSVRow'

import Victory from '@victorops/victory'

const { Table } = Victory

const INCIDENT_LIMIT = 100
const INCIDENT_ACTION_LIMIT = 20

const _truncate = (longString, truncateLength) => {
  return longString.substr(0, truncateLength).concat('...')
}

class OnCallTimelineRows extends React.Component {
  render () {
    const incidents = this.props.incident.get('timeline_of_incident')
    if (typeof incidents === 'undefined') {
      return null
    }
    const showableIncidents = incidents.slice(0, INCIDENT_ACTION_LIMIT)
    const downloadCSVRow =
      <li>
        <OnCallDownloadCSVRow
          type='events'
          endpoint='incidents_csv'
          beginDate={this.props.beginDate}
          endDate={this.props.endDate}
          selectedTeam={this.props.selectedTeam}
          selectedUser={this.props.selectedUser}
        />
      </li>
    return (
      <ul>
        {showableIncidents.map((timelineItem, index) => {
          const eventTime = moment(timelineItem.get('event_time')).format('MMM. D, YYYY - HH:mm')
          const eventText = timelineItem.get('event').length > 60
            ? _truncate(timelineItem.get('event'), 60)
            : timelineItem.get('event')
          return (
            <li className='reporting--on-call--list-item' key={index}>
              {eventTime}&nbsp;&nbsp;&nbsp;&nbsp;{eventText}
            </li>
          )
        })}
        {
          incidents.size > INCIDENT_ACTION_LIMIT
          ? downloadCSVRow
          : null
        }
      </ul>
    )
  }
}

class OnCallActionRows extends React.Component {
  render () {
    const incidents = this.props.incident.get('timeline_of_incident')
    if (typeof incidents === 'undefined') {
      return null
    }
    const showableIncidents = incidents.slice(0, INCIDENT_ACTION_LIMIT)
    return (
      <ul>
        {showableIncidents.map((timelineItem, index) => {
          const interactionText = timelineItem.get('event_interaction').length > 30
            ? _truncate(timelineItem.get('event_interaction'), 30)
            : timelineItem.get('event_interaction')
          return (
            <li className='reporting--on-call--list-item' key={index}>
              { interactionText }
            </li>
          )
        })}
      </ul>
    )
  }
}

class IncidentsOnCallTable extends React.Component {
  _renderDownloadCSVRow () {
    return {
      id: 'incidentsSeeMore',
      columns: [{
        content: '',
        id: 'placeholder1',
        type: 'cell',
        value: 'ALWAYS_ON_BOTTOM'
      },
      {
        component: OnCallDownloadCSVRow,
        id: 'downloadCSV',
        content: {
          type: 'incidents',
          endpoint: 'incidents_csv',
          beginDate: this.props.beginDate,
          endDate: this.props.endDate,
          selectedTeam: this.props.selectedTeam,
          selectedUser: this.props.selectedUser
        },
        type: 'component'
      },
      {
        content: '',
        id: 'placeholder3',
        type: 'cell'
      }]
    }
  }

  _generateUserIncidentRows () {
    const showableIncidents = this.props.incidents.slice(0, INCIDENT_LIMIT)
    const generatedRows = showableIncidents.map((incident, index) => {
      return ({
        id: index,
        columns: [{
          content: incident.get('incident_name'),
          value: incident.get('incident_name'),
          id: 'incident',
          type: 'cell'
        },
        {
          component: OnCallTimelineRows,
          content: {
            incident: incident,
            beginDate: this.props.beginDate,
            endDate: this.props.endDate,
            selectedTeam: this.props.selectedTeam,
            selectedUser: this.props.selectedUser
          },
          id: 'timeline',
          type: 'component'
        },
        {
          component: OnCallActionRows,
          content: {
            incident: incident
          },
          id: 'action',
          type: 'component'
        }]
      })
    })

    if (this.props.incidents.size > INCIDENT_LIMIT) {
      return generatedRows.push(this._renderDownloadCSVRow()).toJS()
    } else {
      return generatedRows.toJS()
    }
  }

  render () {
    const generatedRows = this._generateUserIncidentRows()
    const userIncidentTableConfig = {
      columnHeaders: [
        {
          label: 'Incident',
          isSortable: true
        },
        {
          label: 'Timeline'
        },
        {
          label: 'Who took action'
        }],
      columnWidths: ['30%', '50%', '20%'],
      rowItems: generatedRows,
      customClasses: generatedRows.length > INCIDENT_LIMIT ? ['on-call--user-incidents--table'] : []
    }

    return (
      <div className='oncall--user_incidents'>
        <h3 className='heading-3'>Incidents worked on by {this.props.fullName}</h3>

        <div className='has-loading-gradient'>
          <Table {...userIncidentTableConfig} showLoader={this.props.isLoading} />
        </div>
      </div>
    )
  }
}

export default IncidentsOnCallTable
