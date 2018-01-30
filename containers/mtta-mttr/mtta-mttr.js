import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { BreadCrumbs } from '@victorops/victory'

import Filter from './filter'
import Goals from './goals'
import Graph from './graph'
import MmrTable from './table'

const config = window.VO_CONFIG

function mapStateToProps (state) {
  return {
    graphData: state.mttaMttr.get('graphData'),
    loadingGraphData: state.mttaMttr.get('loadingGraphData')
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

class MttaMttr extends Component {
  render () {
    const ReportsLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>
    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportsLink, active: true},
          {label: 'Performance (MTTA/MTTR) ', uri: 'reports/mtta-ttr', active: true}
        ]} light />

        <h1 className='heading-3'>Performance (MTTA/MTTR) Report</h1>

        <Filter />

        <Goals />

        <Graph graphIsEmpty={!this.props.loadingData} graphData={this.props.graphData} />

        <MmrTable />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttr)
