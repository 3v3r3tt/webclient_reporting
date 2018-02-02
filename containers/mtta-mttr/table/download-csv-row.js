import React from 'react'
import { connect } from 'react-redux'
import config from 'components/__utils/config'

function mapStateToProps (state) {
  return {
    team: state.mttaMttr.get('selectedTeam'),
    start: state.mttaMttr.get('beginDate'),
    end: state.mttaMttr.get('endDate')
  }
}

function mapDispatchToProps (dispatch) {
  return { }
}

class IncidentFrequencyDownloadCSVRow extends React.Component {
  render () {
    const incidentFrequencyCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/performancecsv?teamSlug=${this.props.team}&start=${this.props.start}&end=${this.props.end}`
    const csvHref = encodeURI(incidentFrequencyCSVEndpoint)
    return (
      <a
        href={csvHref}
        target='_blank'
      >
        ...see more incidents by downloading the CSV
      </a>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyDownloadCSVRow)
