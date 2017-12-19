import React, { Component } from 'react'
import config from 'components/__utils/config'

class IncidentFrequencyCSVDownloadButton extends Component {
  render () {
    const {
      beginDate,
      endDate,
      selectedTeam,
      segmentationType,
      resolutionType
    } = this.props

    const incidentFrequencyCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/mttamttrcsv?startDate=${beginDate}&endDate=${endDate}&selectedTeam=${selectedTeam}&segmentationType=${segmentationType}&resolutionType=${resolutionType}`
    const incidentFrequencyCSVHref = encodeURI(incidentFrequencyCSVEndpoint)

    return (
      <a
        className='btn btn-secondary incident-frequency--filter_csv'
        href={incidentFrequencyCSVHref}
        target='_blank'
        title='Export CSV'
        download
      >
        <i className='fal fa-file-alt' /> CSV
      </a>
    )
  }
}

export default IncidentFrequencyCSVDownloadButton
