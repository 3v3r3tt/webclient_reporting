import React, { Component } from 'react'

class IncidentFrequencyCSVDownloadModal extends Component {
  render () {
    return (
      <div className='incident-frequency--csv'>
        <p className='margin-bottom-10'>
          You are requesting a CSV for {this.props.totalIncidents} incidents, but we can only provide you {this.props.limit} incidents at a time.
        </p>
        <p>
          You can either modify the date range and receive your data through multiple CSVs, or <a href='https://victorops.com/contact-support/'>contact support</a> for a full version.
        </p>
        <div>
          <a
            href={this.props.csvHref}
            target='_blank'
            title='Export CSV'className='btn btn-outline-info modal-button'>
            Download {this.props.limit}-row CSV
          </a>
          <a
            onClick={this.props.cancel}
            className='btn btn-secondary modal-button' >
            Cancel
          </a>
        </div>
      </div>
    )
  }
}

export default IncidentFrequencyCSVDownloadModal
