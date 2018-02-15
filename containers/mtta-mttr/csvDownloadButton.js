import React, { Component } from 'react'
import { connect } from 'react-redux'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faFileAlt } from '@fortawesome/fontawesome-pro-light'
import moment from 'moment'

function mapStateToProps (state) {
  return {
    orgslug: state.auth.config.get('orgslug', ''),
    selectedTeam: state.mttaMttr.get('selectedTeam'),
    beginDate: state.mttaMttr.get('beginDate'),
    endDate: state.mttaMttr.get('endDate')
  }
}

class MttaMttrCSVDownloadButton extends Component {
  render () {
    const {
      orgslug,
      beginDate,
      endDate,
      selectedTeam
    } = this.props

    const offset = moment().utcOffset() / 60
    const startOfStart = moment(beginDate).startOf('day').valueOf()
    const endOfEnd = moment(endDate).endOf('day').valueOf()
    const MttaMttrCSVEndpoint = `/api/v1/org/${orgslug}/reports/performancecsv?selectedTeam=${selectedTeam}&startDate=${startOfStart}&endDate=${endOfEnd}&offset=${offset}`
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

export default connect(mapStateToProps, {})(MttaMttrCSVDownloadButton)
