import React from 'react'

import moment from 'moment'

import Victory from '@victorops/victory'

const { Table } = Victory

const _truncate = (longString, truncateLength) => {
  return longString.substr(0, truncateLength).concat('...')
}

class OnCallTimelineRows extends React.Component {
  render () {
    const incidents = this.props.incident.timeline_of_incident
    if (typeof incidents === 'undefined') {
      return null
    }

    return (
      <ul>
        {incidents.map((timelineItem, index) => {
          const eventTime = moment(timelineItem.event_time).format('MMM. D, YYYY - HH:mm')
          if (timelineItem.event.length > 60) {
            timelineItem.event = _truncate(timelineItem.event, 60)
          }
          return (
            <li className='reporting--on-call--list-item' key={index}>
              {eventTime}&nbsp;&nbsp;&nbsp;&nbsp;{timelineItem.event}
            </li>
          )
        })}
      </ul>
    )
  }
}

class OnCallActionRows extends React.Component {
  render () {
    const incidents = this.props.incident.timeline_of_incident
    if (typeof incidents === 'undefined') {
      return null
    }

    return (
      <ul>
        {incidents.map((timelineItem, index) => {
          if (timelineItem.event_interaction.length > 30) {
            timelineItem.event_interaction = _truncate(timelineItem.event_interaction, 30)
          }
          return (
            <li className='reporting--on-call--list-item' key={index}>
              { timelineItem.event_interaction }
            </li>
          )
        })}
      </ul>
    )
  }
}

class IncidentsOnCallTable extends React.Component {
  _generateUserIncidentRows () {
    const generatedRows = this.props.incidents.map((incident, index) => {
      return ({
        id: index,
        columns: [{
          content: incident.incident_name,
          value: incident.incident_name,
          id: 'incident',
          type: 'cell'
        },
        {
          component: OnCallTimelineRows,
          content: {
            incident: incident
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
    return generatedRows.toJS()
  }

  render () {
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
      rowItems: this._generateUserIncidentRows()
    }

    return (
      <div className='oncall--user_incidents'>
        <h3 className='heading-3'>Incidents worked on by {this.props.fullName}</h3>

        <div className='has-loading-gradient'>
          <Table {...userIncidentTableConfig} showLoader={this.props.isLoading} />
          {(!this.props.isLoading && !this.props.incidents.size) ? <p>No data found</p> : null}
        </div>
      </div>
    )
  }
}

export default IncidentsOnCallTable
