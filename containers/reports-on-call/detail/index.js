import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {
  getReportingUserOnCall
} from 'reporting/selectors'

import { reportingOnCallFilterUpdate, reportingOnCallUserGet } from 'reporting/actions/reporting'

import Filter from 'reporting/components/filter-date-team'
import HoursOnCallTable from './hoursOnCallTable'
import IncidentsOnCallTable from './incidentsOnCallTable'

import Victory from '@victorops/victory'

const { BreadCrumbs } = Victory
const config = window.VO_CONFIG

function mapStateToProps (state) {
  return {
    userOnCallData: state.reportingOnCall,
    segmentedUserOnCallData: getReportingUserOnCall(state),
    beginDate: state.reportingOnCall.get('beginDate'),
    endDate: state.reportingOnCall.get('endDate'),
    selectedTeam: state.reportingOnCall.get('selectedTeam'),
    selectedUser: state.reportingOnCall.get('selectedUser'),
    isLoading: state.reportingOnCall.get('loadingData'),
    error: state.reportingOnCall.get('error')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getUserOnCallData: (payload) => dispatch(reportingOnCallUserGet(payload)),
    setFilterOnCall: (payload) => dispatch(reportingOnCallFilterUpdate(payload))
  }
}

class ReportsOnCallDetail extends React.Component {
  componentWillMount () {
    this.props.setFilterOnCall({ selectedUser: this.props.params.slug })
  }

  render () {
    const slug = this.props.params.slug
    const totalOnCallHours = this.props.userOnCallData.getIn(['userData', 'user_rollup', 'total_hours_on_call'])
    const totalIncidentsWorked = this.props.userOnCallData.getIn(['userData', 'user_rollup', 'total_incidents_involved_with'])
    const segmentedOnCalls = this.props.segmentedUserOnCallData
    const incidents = this.props.userOnCallData.getIn(['userData', 'incidents'])

    let fullName = 'Loading'
    if (this.props.selectedUser === this.props.userOnCallData.getIn(['userData', 'user_rollup', 'username'])) {
      fullName = this.props.userOnCallData.getIn(['userData', 'user_rollup', 'full_name'])
    }

    const ReportHomeLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>
    const OnCallListLink = <Link className='link--default' to={`/reports/${config.orgslug}/on-call`}>On-call report</Link>

    const BreadcrumbName = this.props.params.username || fullName || 'Error'
    const OnCallDetailTables =
      <div>
        <h1 className='heading-3'>{fullName} on-call report</h1>

        <Filter
          beginDate={this.props.beginDate}
          endDate={this.props.endDate}
          selectedUser={this.props.params.slug}
          selectedTeam={this.props.selectedTeam}
          getData={this.props.getUserOnCallData}
          filterTeamsBy={this.props.params.slug}
          isDetailPage
        />
        <HoursOnCallTable
          isLoading={this.props.isLoading}
          segmentedOnCalls={segmentedOnCalls}
          totalHours={totalOnCallHours}
          totalIncidents={totalIncidentsWorked}
          beginDate={this.props.beginDate}
          endDate={this.props.endDate}
          selectedTeam={this.props.selectedTeam}
          selectedUser={this.props.selectedUser}
        />

        <IncidentsOnCallTable
          isLoading={this.props.isLoading}
          fullName={fullName}
          incidents={incidents}
          beginDate={this.props.beginDate}
          endDate={this.props.endDate}
          selectedTeam={this.props.selectedTeam}
          selectedUser={this.props.selectedUser}
        />
      </div>

    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportHomeLink, active: true},
          {label: OnCallListLink, active: true},
          {label: BreadcrumbName, uri: slug, active: true}
        ]} light />

        {OnCallDetailTables}

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsOnCallDetail)
