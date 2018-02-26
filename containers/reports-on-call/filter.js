import React, { Component } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'
import CSVDownloadButton from './csvDownloadButton'

import {
  Dropdown,
  DateRangePicker
} from '@victorops/victory'
import _truncate from 'util/truncate'

import { getTeams } from 'reporting/actions/teams'
import { reportingOnCallFilterUpdate } from 'reporting/actions/reporting'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/fontawesome-pro-solid'
import { faUsers } from '@fortawesome/fontawesome-pro-light'

function mapStateToProps (state) {
  return {
    teams: state.teams
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTeams: (payload) => { dispatch(getTeams(payload)) },
    setFilterOnCall: (payload) => dispatch(reportingOnCallFilterUpdate(payload))
  }
}

class OnCallFilter extends Component {
  constructor () {
    super()
    this._beginDateChange = this._beginDateChange.bind(this)
    this._endDateChange = this._endDateChange.bind(this)
    this._isValidEndDate = this._isValidEndDate.bind(this)
    this._isValidBeginDate = this._isValidBeginDate.bind(this)
  }

  componentDidMount () {
    if (this.props.filterTeamsBy) {
      this.props.getTeams({filterBy: this.props.filterTeamsBy})
    } else {
      this.props.getTeams()
    }
    this._getNewTableData()
  }

  _getNewTableData () {
    this.props.getData()
  }
  _endDateChange (momentDate) {
    this.props.setFilterOnCall({endDate: momentDate.endOf('day').valueOf()})
    this._getNewTableData()
  }

  _beginDateChange (momentDate) {
    this.props.setFilterOnCall({beginDate: momentDate.valueOf()})
    this._getNewTableData()
  }

  _teamChange (team = '') {
    return () => {
      this.props.setFilterOnCall({selectedTeam: team})
      this._getNewTableData()
    }
  }

  _isValidBeginDate (current) {
    var lastYear = moment().subtract(13, 'months')
    return current.isAfter(lastYear) && current.isBefore(this.props.endDate)
  }

  _isValidEndDate (current) {
    var tomorrow = moment()
    return current.isAfter(this.props.beginDate) && current.isBefore(tomorrow)
  }

  _renderTeamsDropdown () {
    const teams = this.props.teams
    if (!teams.size) return null
    let selectedTeamName = 'All'

    const dropDownItems = [
      {
        label: 'All',
        handleClick: this._teamChange('')
      }
    ]

    teams.map((team) => {
      const teamName = team.get('name', '')
      const teamSlug = team.get('slug')
      if (this.props.selectedTeam === teamSlug) selectedTeamName = teamName
      dropDownItems.push({
        label: teamName,
        handleClick: this._teamChange(teamSlug)
      })
    })
    const LabelComponent =
      <span className='filter--team-label'>
        <FontAwesomeIcon icon={faUsers} />
        <span className='filter--team-label-text'>{_truncate(selectedTeamName, 16)}</span>
        <FontAwesomeIcon icon={faAngleDown} />
      </span>

    return (
      <Dropdown
        dropdownItems={dropDownItems}
        labelComponent={LabelComponent}
        triggerClasses={['btn', 'btn-secondary', 'dropdown-btn']}
        customClasses={['filter--dropdown-div']}
      />
    )
  }

  render () {
    return (
      <div className='on-call--filter'>
        { this._renderTeamsDropdown() }
        <div className='on-call--filter_dateselector'>
          <DateRangePicker
            beginDate={{
              isValidDate: this._isValidBeginDate,
              onChange: this._beginDateChange,
              defaultValue: this.props.beginDate,
              value: this.props.beginDate
            }}
            endDate={{
              isValidDate: this._isValidEndDate,
              onChange: this._endDateChange,
              defaultValue: this.props.endDate,
              value: this.props.endDate
            }} />
        </div>
        <CSVDownloadButton {...this.props} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnCallFilter)
