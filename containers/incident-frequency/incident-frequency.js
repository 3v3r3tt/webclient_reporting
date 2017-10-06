import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Victory from '@victorops/victory'

import Filter from 'reporting/components/filter-date-team'
import Graph from './graph'

import {
  incidentFrequencyTableGet
} from 'reporting/actions/incident-frequency'

const {
  BreadCrumbs,
  Table
} = Victory

const config = window.VO_CONFIG

function mapStateToProps (state) {
  return {
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTeamIFData: (payload) => dispatch(incidentFrequencyTableGet(payload))
  }
}

class IncidentFrequency extends Component {
  _generateIncidentFrequencyRows (incidentFrequencyData) {
    if (!incidentFrequencyData) return []
    const generatedRows = incidentFrequencyData.map((data, index) => {
      return ({
        id: data.get('name', ''),
        key: index,
        columns: [{
          content: data.get('name', ''),
          value: data.get('name', ''),
          id: 'name',
          type: 'cell'
        },
        {
          content: data.get('service', 0),
          value: data.get('service', 0),
          id: 'service',
          type: 'cell'
        },
        {
          content: data.get('alert_count', 0),
          value: data.get('alert_count', 0),
          id: 'alert_count',
          type: 'cell'
        },
        {
          content: data.get('time_to_ack', 0),
          value: data.get('time_to_ack', 0),
          id: 'time_to_ack',
          type: 'cell'
        },
        {
          content: data.get('time_to_resolve', 0),
          value: data.get('time_to_resolve', 0),
          id: 'time_to_resolve',
          type: 'cell'
        }]
      })
    })
    return generatedRows.toJS()
  }

  render () {
    const ReportHomeLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>
    const generatedRows = this._generateIncidentFrequencyRows(this.props.incidentFrequencyData)
    const incidentFrequencyTableConfig = {
      columnHeaders: [
        {
          label: 'Incident Name',
          isSortable: true
        },
        {
          label: 'Service',
          isSortable: true
        },
        {
          label: '# of Alerts',
          isSortable: true
        },
        {
          label: 'TTA',
          isSortable: true
        },
        {
          label: 'TTR',
          isSortable: true
        }],
      columnWidths: ['50%', '15%', '11%', '12%', '12%'],
      rowItems: generatedRows,
      generateRowClickFn: this._rowClickFnGenerator
    }

    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportHomeLink, active: true},
          {label: 'Incident Frequency', uri: '#reports/incident-frequcy', active: true}
        ]} light />

        <h1 className='heading-3'>Incident Frequency Report</h1>

        <Filter
          beginDate={this.props.beginDate}
          endDate={this.props.endDate}
          selectedUser={null}
          selectedTeam={this.props.selectedTeam}
          getData={this.props.getTeamIFData}
        />

        <Graph />
        <div className='has-loading-gradient margin-top-10'>
          <Table {...incidentFrequencyTableConfig} showLoader={this.props.isLoading} />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequency)
