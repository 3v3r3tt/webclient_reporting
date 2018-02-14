import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { BreadCrumbs } from '@victorops/victory'

import {
  mttaMttrFilterUpdate,
  mttaMttrGraphGet
} from 'reporting/actions/mtta-mttr'

import Filter from './filter'
import Goals from './goals'
import Graph from './graph'
import YAxisScaleSelector from './y-axis-scale-selector'
import MmrTable from './table'

const config = window.VO_CONFIG

function mapStateToProps (state) {
  return {
    graphData: state.mttaMttr.get('graphData'),
    loadingGraphData: state.mttaMttr.get('loadingGraphData'),
    yAxisType: state.mttaMttr.get('yAxisType')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setFilterMttaMttr: (payload) => dispatch(mttaMttrFilterUpdate(payload)),
    getMttaMttrGraph: (payload) => dispatch(mttaMttrGraphGet(payload))
  }
}

class MttaMttr extends Component {
  render () {
    const ReportsLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>
    const yAxisTypeName = this.props.yAxisType.get('name')
    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportsLink, active: true},
          {label: 'Performance (MTTA/MTTR) ', uri: 'reports/mtta-ttr', active: true}
        ]} light />

        <h1 className='heading-3'>Performance (MTTA/MTTR) Report</h1>

        <Filter />

        <Goals />

        <Graph
          graphIsEmpty={!this.props.loadingData}
          graphData={this.props.graphData}
        />

        <YAxisScaleSelector
          yAxisTypeName={yAxisTypeName}
          setFilterMttaMttr={this.props.setFilterMttaMttr}
          getMttaMttrGraph={this.props.getMttaMttrGraph}
        />

        <MmrTable />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttr)
