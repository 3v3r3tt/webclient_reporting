import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

function mapStateToProps (state) {
  return {
    orgslug: state.auth.config.get('orgslug', ''),
    team: state.mttaMttr.get('selectedTeam'),
    start: state.mttaMttr.get('beginDate'),
    end: state.mttaMttr.get('endDate')
  }
}

function mapDispatchToProps (dispatch) {
  return { }
}

class MttaMttrDownloadCSVRow extends React.Component {
  render () {
    const offset = moment().utcOffset() / 60
    const MttaMttrCSVEndpoint = `/api/v1/org/${this.props.orgslug}/reports/performancecsv?selectedTeam=${this.props.team}&startDate=${this.props.start}&endDate=${this.props.end}&offset=${offset}`
    const csvHref = encodeURI(MttaMttrCSVEndpoint)

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

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttrDownloadCSVRow)
