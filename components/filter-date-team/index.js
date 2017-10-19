import React, { Component } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'
import when from 'when'
import { fetch } from 'components/__utils/xhr'
import config from 'components/__utils/config'
import error from 'util/extendedLog'

import CSVDownloadButton from '../csv-download-button'

import Victory from '@victorops/victory'

import { getTeams } from 'reporting/actions/teams'
import { reportingOnCallFilterUpdate } from 'reporting/actions/reporting'

const {
  Dropdown,
  DateRangePicker
} = Victory

function mapStateToProps (state) {
  return {
    teams: state.teams
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTeams: (payload) => dispatch(getTeams(payload)),
    setFilterOnCall: (payload) => dispatch(reportingOnCallFilterUpdate(payload))
  }
}

class Filter extends Component {
  constructor () {
    super()
    this._beginDateChange = this._beginDateChange.bind(this)
    this._endDateChange = this._endDateChange.bind(this)
    this._isValidEndDate = this._isValidEndDate.bind(this)
    this._isValidBeginDate = this._isValidBeginDate.bind(this)
    this._getTeamsForUser = this._getTeamsForUser.bind(this)

    this.state = {
      userTeams: null
    }
  }

  componentDidMount () {
    this.props.getTeams()
    if (this.props.isDetailPage) this._getTeamsForUser()
    this._getNewTableData()
  }

  _getTeamsForUser () {
    const getUserTeams = fetch(`/api/v1/org/${config.auth.org.slug}/users/${this.props.selectedUser}/teams`)
    when(getUserTeams)
      .then((teams) => {
        this.setState({
          userTeams: teams.map((teamObject) => teamObject.team.slug)
        })
      }).catch((err) => {
        error(`Error fetching teams for user: ${err}`)
      })
  }

  _getNewTableData () {
    this.props.getData()
  }

  _endDateChange (momentDate) {
    this.props.setFilterOnCall({endDate: momentDate.valueOf()})
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
    const mustFilterTeams = this.props.isDetailPage && !this.state.userTeams
    if (!teams.size || mustFilterTeams) return null
    let selectedTeamName = 'All'

    const dropDownItems = [
      {
        label: 'All',
        handleClick: this._teamChange('')
      }
    ]

    teams.forEach((team) => {
      const teamName = team.get('name', '')
      const teamSlug = team.get('slug')
      if (this.props.selectedTeam === teamSlug) selectedTeamName = teamName
      if (!this.state.userTeams || this.state.userTeams.indexOf(teamSlug) > -1) {
        dropDownItems.push({
          label: teamName,
          handleClick: this._teamChange(teamSlug)
        })
      }
    })
    const LabelComponent =
      <span className='filter--team-label'>
        <i className='fal fa-users' />
        <span className='filter--team-label-text'>{selectedTeamName}</span>
        <i className='fas fa-angle-down' />
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
        <div className='row'>
          <div className='col-12 col-md-9'>
            { this._renderTeamsDropdown() }
            <div className='on-call--filter_dateselector'>
              <DateRangePicker
                beginDate={{
                  isValidDate: this._isValidBeginDate,
                  onChange: this._beginDateChange,
                  defaultValue: this.props.beginDate
                }}
                endDate={{
                  isValidDate: this._isValidEndDate,
                  onChange: this._endDateChange,
                  defaultValue: this.props.endDate
                }}
            />
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <CSVDownloadButton {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
