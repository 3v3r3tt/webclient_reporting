import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Victory from '@victorops/victory'

import Filter from 'reporting/components/filter-date-team'
import Graph from './graph'

const {
  BreadCrumbs,
  Table
} = Victory

const config = window.VO_CONFIG

function mapStateToProps (state) {
  return {
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    startDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate')
  }
}

function mapDispatchToProps (dispatch) {
  return { }
}

class IncidentFrequency extends Component {
  render () {
    const ReportHomeLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>

    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportHomeLink, active: true},
          {label: 'Incident Frequency', uri: '#reports/incident-frequcy', active: true}
        ]} light />

        <h1 className='heading-2'>Incident Frequency Report</h1>

        <Filter
          beginDate={this.props.startDate}
          endDate={this.props.endDate}
          selectedUser={null}
          selectedTeam={this.props.selectedTeam}
          getData={() => { console.log('needs to get data') }}
        />

        <Graph />
        <div className='has-loading-gradient'>
          <Table showLoader={this.props.isLoading} />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequency)
