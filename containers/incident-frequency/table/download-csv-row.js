import React from 'react'
import { connect } from 'react-redux'
import config from 'components/__utils/config'
import IncidentFrequencyCsvModal from '../csvDownloadModal'

import {
  hideModal,
  showModal
} from 'reporting/actions/modal'

function mapStateToProps (state) {
  return {
    team: state.incidentFrequency.get('selectedTeam'),
    start: state.incidentFrequency.get('beginDate'),
    end: state.incidentFrequency.get('endDate')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: (payload) => dispatch(hideModal(payload)),
    showModal: (payload) => dispatch(showModal(payload))
  }
}

class IncidentFrequencyDownloadCSVRow extends React.Component {
  _openCsvWarningModal (csvHref) {
    return (e) => {
      e.preventDefault()
      const modalConfig = {
        modalType: 'confirm',
        modalProps: {
          title: 'This CSV will not contain all report data',
          component: <IncidentFrequencyCsvModal
            totalIncidents={this.props.totalIncidents}
            csvHref={csvHref}
            limit={this.props.CSV_SIZE_WARNING_LIMIT}
            cancel={this.props.hideModal}
          />,
          onCancel: () => this.props.hideModal(),
          actionBar: false
        }
      }

      this.props.showModal(modalConfig)
    }
  }

  render () {
    const incidentFrequencyCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencycsv?teamSlug=${this.props.team}&start=${this.props.start}&end=${this.props.end}`
    const csvHref = encodeURI(incidentFrequencyCSVEndpoint)
    if (this.props.totalIncidents > this.props.CSV_SIZE_WARNING_LIMIT) {
      return (
        <a
          title='Export CSV'
          href={csvHref}
          onClick={this._openCsvWarningModal(csvHref)}
        >
          ...see more incidents by downloading the CSV
        </a>
      )
    } else {
      return (
        <a
          title='Export CSV'
          href={csvHref}
        >
          ...see more incidents by downloading the CSV
        </a>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyDownloadCSVRow)
