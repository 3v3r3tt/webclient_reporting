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

    const incidentFrequencyReport =
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

    const notEnoughDataView =
      <div>
        <div className='container module-wrapper'>
          <BreadCrumbs breadcrumbs={[
            {label: ReportHomeLink, active: true},
            {label: 'Incident Frequency', uri: '#reports/incident-frequcy', active: true}
          ]} light />

          <h1 className='heading-3'>Incident Frequency Report</h1>
        </div>

        <div className='incident-frequency--not-enough-data'>
          <div className='incident-frequency--not-enough-data--content'>
            <h2 className='header'>You don't have enough data to graph (yet)</h2>
            <p className='details'>Incident Frequency is a powerful tool for <strong>uncovering your noisiest services, hosts and integrations,</strong> but you haven’t been using VictorOps long enough to benefit from it.</p>

            <p className='details'><strong>Here are a few examples</strong> of Incident Frequency reports that you might see once you use VictorOps a bit more:</p>
            <div className='images'>
              <img className='image' src='/public/img/IFR_demoimg.png' />
              <img className='image' src='/public/img/IFR_demoimg.png' />
              <img className='image' src='/public/img/IFR_demoimg.png' />
            </div>
          </div>
        </div>
      </div>

    return (this.props.graphDataExists ? incidentFrequencyReport : notEnoughDataView)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequency)
