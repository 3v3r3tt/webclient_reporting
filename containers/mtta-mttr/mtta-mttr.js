import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Victory from '@victorops/victory'

import Filter from './filter'
// import Graph from './graph'
// import Table from './table'

const {
  BreadCrumbs
} = Victory

const config = window.VO_CONFIG

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

class IncidentFrequency extends Component {
  render () {
    const ReportsLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>
    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportsLink, active: true},
          {label: 'Performance (MTTA/MTTR) ', uri: 'reports/mtta-ttr', active: true}
        ]} light />

        <h1 className='heading-3'>Performance (MTTA/MTTR) report</h1>

        <Filter />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequency)
