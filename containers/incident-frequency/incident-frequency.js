import React, { Component } from 'react'
import { Link } from 'react-router'
import Victory from '@victorops/victory'

import Filter from './filter'
import IncidentFrequencyGraph from './graph'
import IncidentFrequencyTable from './table'

const { BreadCrumbs } = Victory

const config = window.VO_CONFIG

const COLOR_LIST = [
  '#FFD163', '#F1582F', '#5175CA', '#ABCB79', '#6C6C6C',
  '#FF8D22', '#B664E4', '#69E7C7', '#E762A7', '#0037AB',
  '#72EA31', '#51A8CA', '#DCA326', '#5A3EBA', '#B7B7B7'
]

class IncidentFrequency extends Component {
  render () {
    const ReportHomeLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>

    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportHomeLink, active: true},
          {label: 'Incident Frequency', uri: '#reports/incident-frequcy', active: true}
        ]} light />

        <h1 className='heading-3'>Incident Frequency Report</h1>

        <Filter />

        <IncidentFrequencyGraph colorList={COLOR_LIST} />

        <IncidentFrequencyTable colorList={COLOR_LIST} />
      </div>
    )
  }
}

export default IncidentFrequency
