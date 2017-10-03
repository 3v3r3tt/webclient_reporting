import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Victory from '@victorops/victory'

import Filter from 'reporting/components/filter-date-team'

import {
  reportingOnCallTeamGet
} from 'reporting/actions/reporting'

const {
  BreadCrumbs,
  Table
} = Victory

const config = window.VO_CONFIG

function mapStateToProps (state) {
  return {
    teamOnCallData: state.reportingOnCall,
    isLoading: state.reportingOnCall.get('loadingData'),
    error: state.reportingOnCall.get('error')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTeamOnCallData: (payload) => dispatch(reportingOnCallTeamGet(payload))
  }
}

class ReportsOnCallList extends Component {
  constructor (props) {
    super(props)

    this._rowClickFnGenerator = this._rowClickFnGenerator.bind(this)
  }

  _goToUserDetailPage (username) {
    this.props.router.push(`/reports/${this.props.params.org}/on-call/${username}`)
  }

  _generateOnCallRows (teamOnCallData) {
    const _teamData = teamOnCallData.getIn(['teamData', 'members'])
    const generatedRows = _teamData.map((userData, index) => {
      return ({
        id: userData.get('username', ''),
        key: index,
        columns: [{
          content: userData.get('full_name', ''),
          value: userData.get('full_name', 'zz'),
          id: 'name',
          type: 'cell'
        },
        {
          content: userData.get('total_hours_on_call', 0),
          value: userData.get('total_hours_on_call', 0),
          id: 'on-call-hours',
          type: 'cell'
        },
        {
          content: userData.get('total_incidents_involved_with', 0),
          value: userData.get('total_incidents_involved_with', 0),
          id: 'incidents-involved-with',
          type: 'cell'
        }]
      })
    })
    return generatedRows.toJS()
  }

  _rowClickFnGenerator (rowId) {
    return () => {
      this._goToUserDetailPage(rowId)
    }
  }

  render () {
    const generatedRows = this._generateOnCallRows(this.props.teamOnCallData)
    const onCallTableConfig = {
      columnHeaders: [
        {
          label: 'Team member',
          isSortable: true
        },
        {
          label: 'Hours on-call',
          isSortable: true
        },
        {
          label: '# of incidents worked',
          isSortable: true
        }],
      columnWidths: ['40%', '30%', '30%'],
      rowItems: generatedRows,
      generateRowClickFn: this._rowClickFnGenerator
    }

    const ReportHomeLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>

    const OnCallListErrorMessage = <p className='text-center text--bold mt-5'>Could not load your report data - please try again later.</p>
    const OnCallListView =
      <div>
        <p>&quot;On-call&quot; means this person was on the first step in an escalation policy.</p>
        <Filter getData={this.props.getTeamOnCallData} />
        <div className='has-loading-gradient'>
          <Table showLoader={this.props.isLoading} {...onCallTableConfig} />
        </div>
      </div>

    let VisiblePage = this.props.error.get('list') ? OnCallListErrorMessage : OnCallListView

    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportHomeLink, active: true},
          {label: 'On-call report', uri: '#reports/on-call', active: true}
        ]} light />

        <h1 className='heading-2'>On-Call Reports</h1>

        { VisiblePage }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsOnCallList)
