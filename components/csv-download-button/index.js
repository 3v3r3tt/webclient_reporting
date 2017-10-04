import React, { Component } from 'react'
import config from 'components/__utils/config'

import Victory from '@victorops/victory'
const { Dropdown } = Victory

class CSVDownloadButton extends Component {
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
            className='text-center dropdown-item'
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
            className='text-center dropdown-item'
            download
          >
            Incidents Worked
          </a>
        }
      ]
      const DropdownLabel =
        <span>
          <i className='far fa-file-excel' /> Export CSV
        </span>
      return (
        <Dropdown
          dropdownItems={exportCSVOptions}
          labelComponent={DropdownLabel}
          triggerClasses={['btn', 'btn-secondary']}
          customClasses={['dropdown-wrapper dropdown', 'dropdown-div', 'on-call--filter_csv_dropdown']}
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
          <i className='far fa-file-excel' /> Export CSV
        </a>
      )
    }
  }
}

export default CSVDownloadButton
