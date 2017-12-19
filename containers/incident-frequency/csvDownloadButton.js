import React, { Component } from 'react'
import config from 'components/__utils/config'

class mttaMttrCSVDownloadButton extends Component {
  render () {
    const {
      beginDate,
      endDate,
      selectedTeam,
      segmentationType,
      resolutionType
    } = this.props

    const mttaMttrCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/mttaMttrcsv?startDate=${beginDate}&endDate=${endDate}&selectedTeam=${selectedTeam}&segmentationType=${segmentationType}&resolutionType=${resolutionType}`
    const mttaMttrCSVHref = encodeURI(mttaMttrCSVEndpoint)

    return (
      <a
        className='btn btn-secondary mtta-mttr--filter_csv'
        href={mttaMttrCSVHref}
        target='_blank'
        title='Export CSV'
        download
      >
        <i className='fal fa-file-alt' /> CSV
      </a>
    )
  }
}

export default mttaMttrCSVDownloadButton
