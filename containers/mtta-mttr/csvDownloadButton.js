import React, { Component } from 'react'
import config from 'components/__utils/config'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/fontawesome-pro-light'

class MttaMttrCSVDownloadButton extends Component {
  render () {
    const {
      beginDate,
      endDate,
      selectedTeam
    } = this.props

    const MttaMttrCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/performancecsv?startDate=${beginDate}&endDate=${endDate}&selectedTeam=${selectedTeam}`
    const MttaMttrCSVHref = encodeURI(MttaMttrCSVEndpoint)

    return (
      <a
        className='btn btn-secondary reports--filter_csv'
        href={MttaMttrCSVHref}
        target='_blank'
        title='CSV'
        download
      >
        <FontAwesomeIcon icon={faFileAlt} /> CSV
      </a>
    )
  }
}

export default MttaMttrCSVDownloadButton
