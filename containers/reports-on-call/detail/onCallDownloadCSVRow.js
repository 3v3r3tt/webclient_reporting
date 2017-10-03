import React from 'react'
import config from 'components/__utils/config'

class OnCallDownloadCSVRow extends React.Component {
  render () {
    const endpoint = `/api/v1/org/${config.auth.org.slug}/reports/oncalluser/${this.props.endpoint}?user=${this.props.selectedUser}&team=${this.props.selectedTeam}&startDate=${this.props.beginDate}&endDate=${this.props.endDate}`
    const csvHref = encodeURI(endpoint)
    return (
      <a
        href={csvHref}
        target='_blank'
        download
      >
        ...see more {this.props.type} by downloading the CSV
      </a>
    )
  }
}

export default OnCallDownloadCSVRow
