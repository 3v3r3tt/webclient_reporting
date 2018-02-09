import React, { Component } from 'react'
import config from 'components/__utils/config'

import { Dropdown } from '@victorops/victory'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/fontawesome-pro-light'
import { faAngleDown } from '@fortawesome/fontawesome-pro-solid'

class OnCallCSVDownloadButton extends Component {
  render () {
    const {
      beginDate,
      endDate,
      selectedUser,
      selectedTeam
    } = this.props

    if (this.props.isDetailPage) {
      const hoursOnCallCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/oncalluser/oncall_csv?user=${selectedUser}&team=${selectedTeam}&startDate=${beginDate}&endDate=${endDate}`
      const onCallCSVHref = encodeURI(hoursOnCallCSVEndpoint)

      const incidentsWorkedCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/oncalluser/incidents_csv?user=${selectedUser}&team=${selectedTeam}&startDate=${beginDate}&endDate=${endDate}`
      const incidentsWorkedCSVHref = encodeURI(incidentsWorkedCSVEndpoint)

      const exportCSVOptions = [
        {
          label: 'Hours On-Call',
          content: <a
            href={onCallCSVHref}
            target='_blank'
            className='dropdown-item'
            download
          >
            Hours On-Call
          </a>
        },
        {
          label: 'Incidents Worked',
          content: <a
            href={incidentsWorkedCSVHref}
            target='_blank'
            className='dropdown-item'
            download
          >
            Incidents Worked
          </a>
        }
      ]
      const DropdownLabel =
        <span className='filter--csv-dropdown'>
          <FontAwesomeIcon icon={faFileAlt} />
          <span className='filter--csv-label-text'>CSV</span>
          <FontAwesomeIcon icon={faAngleDown} />
        </span>
      return (
        <Dropdown
          dropdownItems={exportCSVOptions}
          labelComponent={DropdownLabel}
          triggerClasses={['btn', 'btn-secondary']}
          customClasses={['fal-calendar-alt', 'dropdown-wrapper dropdown', 'dropdown-div', 'on-call--filter_csv_dropdown']}
        />
      )
    } else {
      const teamOnCallCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/oncallmain/csv?team=${selectedTeam}&startDate=${beginDate}&endDate=${endDate}`
      const teamOnCallCSVHref = encodeURI(teamOnCallCSVEndpoint)

      return (
        <a
          className='btn btn-secondary on-call--filter_csv'
          href={teamOnCallCSVHref}
          target='_blank'
          download
        >
          <FontAwesomeIcon icon={faFileAlt} /> CSV
        </a>
      )
    }
  }
}

export default OnCallCSVDownloadButton
