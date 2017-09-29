import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { getReportingUserOnCall } from 'reporting/selectors'
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
    startDate: state.reportingOnCall.get('startDate'),
    endDate: state.reportingOnCall.get('endDate'),
    selectedTeam: state.reportingOnCall.get('selectedTeam'),
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
    const fullName = this.props.userOnCallData.getIn(['userData', 'user_rollup', 'full_name'])
    const totalOnCallHours = this.props.userOnCallData.getIn(['userData', 'user_rollup', 'total_hours_on_call'])
    const totalIncidentsWorked = this.props.userOnCallData.getIn(['userData', 'user_rollup', 'total_incidents_involved_with'])
    const segmentedOnCalls = this.props.segmentedUserOnCallData
    const incidents = this.props.userOnCallData.getIn(['userData', 'incidents'])

    const ReportHomeLink = <Link className='link--default' to={`/reports/${config.orgslug}`}>Reports</Link>
    const OnCallListLink = <Link className='link--default' to={`/reports/${config.orgslug}/on-call`}>On-call report</Link>

    const BreadcrumbName = fullName || 'Error'
    const OnCallListErrorMessage =
      <div>
        <h1 className='heading-2'>On-Call Reports</h1>
        <p className='text-center text--bold mt-5'>
          Could not load your report data - please try again later.
        </p>
      </div>

    const OnCallDetailTables =
      <div>
        <h1 className='heading-2'>{fullName} on-call report</h1>

        <Filter getData={this.props.getUserOnCallData} />
        <HoursOnCallTable
          isLoading={this.props.isLoading}
          segmentedOnCalls={segmentedOnCalls}
          totalHours={totalOnCallHours}
          totalIncidents={totalIncidentsWorked}
        />

        <IncidentsOnCallTable isLoading={this.props.isLoading} fullName={fullName} incidents={incidents} />
      </div>

    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportHomeLink, active: true},
          {label: OnCallListLink, active: true},
          {label: BreadcrumbName, uri: slug, active: true}
        ]} light />

        {this.props.error.get('detail') ? OnCallListErrorMessage : OnCallDetailTables}

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsOnCallDetail)
