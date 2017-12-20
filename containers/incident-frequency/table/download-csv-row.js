import React from 'react'
import { connect } from 'react-redux'
import config from 'components/__utils/config'

function mapStateToProps (state) {
  return {
    team: state.incidentFrequency.get('selectedTeam'),
    start: state.incidentFrequency.get('beginDate'),
    end: state.incidentFrequency.get('endDate')
  }
}

function mapDispatchToProps (dispatch) {
  return { }
}

class IncidentFrequencyDownloadCSVRow extends React.Component {
  render () {
    const incidentFrequencyCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencycsv?teamSlug=${this.props.team}&start=${this.props.start}&end=${this.props.end}`
    const csvHref = encodeURI(incidentFrequencyCSVEndpoint)
    return (
      <a
        href={csvHref}
        target='_blank'
        download
      >
        ...see more incidents by downloading the CSV
      </a>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyDownloadCSVRow)
