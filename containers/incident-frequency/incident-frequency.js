import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Victory from '@victorops/victory'

import Filter from './filter'
import IncidentFrequencyGraph from './graph'
import IncidentFrequencyTable from './table'

import { incidentFrequencyTableReset } from 'reporting/actions/incident-frequency'

const {
  BreadCrumbs,
  Button
} = Victory

const config = window.VO_CONFIG

const COLOR_LIST = [
  '#FFD163', '#F1582F', '#5175CA', '#ABCB79', '#6C6C6C',
  '#FF8D22', '#B664E4', '#69E7C7', '#E762A7', '#0037AB',
  '#72EA31', '#51A8CA', '#DCA326', '#5A3EBA', '#B7B7B7'
]

function mapStateToProps (state) {
  return {
    graphDataExists: state.incidentFrequency.getIn(['graphData', 'has_data_flag'], true),
    reducedData: state.incidentFrequency.getIn(['reducedData', 'reducedRows'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    resetReducedTable: (payload) => dispatch(incidentFrequencyTableReset(payload))
  }
}

class IncidentFrequency extends Component {
  constructor (props) {
    super(props)

    this._resetTableData = this._resetTableData.bind(this)
  }

  _resetTableData () {
    const plotLine = document.getElementsByClassName('highcharts-plot-lines-9999')[0]
    plotLine.style.display = 'none'
    this.props.resetReducedTable()
  }

  render () {
    const ReportHomeLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>
    const ClearBucketSelectionButton =
      <Button
        content='Reset'
        type='btn btn-warning incident-frequency--graph--button'
        clickHandler={this._resetTableData}
      />

    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportHomeLink, active: true},
          {label: 'Incident Frequency', uri: '#reports/incident-frequcy', active: true}
        ]} light />

        <h1 className='heading-3'>Incident Frequency Report</h1>

        <Filter />

        { this.props.reducedData ? ClearBucketSelectionButton : null }

        <IncidentFrequencyGraph colorList={COLOR_LIST} />

        <IncidentFrequencyTable colorList={COLOR_LIST} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequency)
