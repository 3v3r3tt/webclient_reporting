import React, { Component } from 'react'
import { connect } from 'react-redux'

import config from 'components/__utils/config'

import {
  hideModal,
  showModal
} from 'reporting/actions/modal'
import IncidentFrequencyCsvModal from './csvDownloadModal'

function mapDispatchToProps (dispatch) {
  return {
    hideModal: (payload) => dispatch(hideModal(payload)),
    showModal: (payload) => dispatch(showModal(payload))
  }
}

const CSV_SIZE_WARNING_LIMIT = 1000

class IncidentFrequencyCSVDownloadButton extends Component {
  constructor (props) {
    super(props)

    this._openCsvWarningModal = this._openCsvWarningModal.bind(this)
  }

  _openCsvWarningModal (csvHref) {
    return () => {
      const modalConfig = {
        modalType: 'confirm',
        modalProps: {
          title: 'This CSV will not contain all report data',
          component: <IncidentFrequencyCsvModal
            totalIncidents={this.props.totalIncidents}
            csvHref={csvHref}
            limit={CSV_SIZE_WARNING_LIMIT}
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
    const {
      beginDate,
      endDate,
      selectedTeam,
      totalIncidents
    } = this.props

    const incidentFrequencyCSVEndpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencycsv?teamSlug=${selectedTeam}&start=${beginDate}&end=${endDate}`
    const incidentFrequencyCSVHref = encodeURI(incidentFrequencyCSVEndpoint)

    if (totalIncidents <= CSV_SIZE_WARNING_LIMIT) {
      return (
        <a
          className='btn btn-secondary incident-frequency--filter_csv'
          href={incidentFrequencyCSVHref}
          target='_blank'
          title='Export CSV'
        >
          <i className='fal fa-file-alt' /> CSV
        </a>
      )
    } else {
      return (
        <a
          className='btn btn-secondary incident-frequency--filter_csv'
          title='Export CSV'
          onClick={this._openCsvWarningModal(incidentFrequencyCSVHref)}
        >
          <i className='fal fa-file-alt' /> CSV
        </a>
      )
    }
  }
}

export default connect(null, mapDispatchToProps)(IncidentFrequencyCSVDownloadButton)
