import React, { Component } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'
import { Map } from 'immutable'
import {
  clone,
  takeWhile
} from 'lodash'
import _truncate from 'util/truncate'

import Victory from '@victorops/victory'

import { getTeams } from 'reporting/actions/teams'
import { getRouteKeys } from 'reporting/actions/route-keys'

import {
  getReducedRouteKeys
} from 'reporting/selectors'

import {
  mttaMttrFilterUpdate,
  mttaMttrGraphGet,
  mttaMttrTableGet,
  mttaMttrRouteKeyUpdate
} from 'reporting/actions/mtta-mttr'

const {
  Dropdown,
  DateRangePicker,
  MultiSelectDropdown
} = Victory

function mapStateToProps (state) {
  return {
    teams: state.teams,
    routeKeys: getReducedRouteKeys(state),
    selectedTeam: state.mttaMttr.get('selectedTeam'),
    beginDate: state.mttaMttr.get('beginDate'),
    endDate: state.mttaMttr.get('endDate'),
    resolutionType: state.mttaMttr.get('resolutionType'),
    yAxisType: state.mttaMttr.get('yAxisType')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTeams: (payload) => dispatch(getTeams(payload)),
    getRouteKeys: (payload) => dispatch(getRouteKeys(payload)),
    setFilterMttaMttr: (payload) => dispatch(mttaMttrFilterUpdate(payload)),
    getMttaMttrGraph: (payload) => dispatch(mttaMttrGraphGet(payload)),
    getMttaMttrTable: (payload) => dispatch(mttaMttrTableGet(payload)),
    setRouteKeysMttaMttr: (payload) => dispatch(mttaMttrRouteKeyUpdate(payload))
  }
}

class mttaMttrFilter extends Component {
  constructor (props) {
    super(props)

    this.allResolutionTypes = [
      {
        label: 'Display daily',
        type: 'day',
        handleClick: () => {
          this._setFilter('resolutionType', Map({name: 'Display daily', type: 'day'}))
        }
      },
      {
        label: 'Display weekly',
        type: 'week',
        handleClick: () => {
          this._setFilter('resolutionType', Map({name: 'Display weekly', type: 'week'}))
        }
      },
      {
        label: 'Display monthly',
        type: 'month',
        handleClick: () => {
          this._setFilter('resolutionType', Map({name: 'Display monthly', type: 'month'}))
        }
      }
    ]
    this.resolutionTypes = clone(this.allResolutionTypes)
    this.yAxisTypes = [
      {
        label: 'Linear',
        handleClick: () => {
          this._setFilter('yAxisType', Map({name: 'Linear', type: 'linear'}))
        }
      },
      {
        label: 'Logarithmic',
        handleClick: () => {
          this._setFilter('yAxisType', Map({name: 'Logarithmic', type: 'logarithmic'}))
        }
      }
    ]

    this._beginDateChange = this._beginDateChange.bind(this)
    this._endDateChange = this._endDateChange.bind(this)
    this._isValidEndDate = this._isValidEndDate.bind(this)
    this._isValidBeginDate = this._isValidBeginDate.bind(this)
    this._checkDateRange = this._checkDateRange.bind(this)
    this._setFilter = this._setFilter.bind(this)
  }

  componentDidMount () {
    this.props.getTeams()
    this.props.getRouteKeys()
    this._getNewGraphData()
    this._getNewTableData()
  }

  _getNewGraphData () {
    this.props.getMttaMttrGraph()
  }

  _getNewTableData () {
    this.props.getMttaMttrTable()
  }

  _setFilter (type, value) {
    const payload = {[type]: value}
    this.props.setFilterMttaMttr(payload)
    this._getNewGraphData()
    this._getNewTableData()
  }

  _endDateChange (momentDate) {
    this.props.setFilterMttaMttr({endDate: momentDate.valueOf()})
    this._checkDateRange(moment(this.props.beginDate), momentDate)
  }

  _beginDateChange (momentDate) {
    this.props.setFilterMttaMttr({beginDate: momentDate.valueOf()})
    this._checkDateRange(momentDate, moment(this.props.endDate))
  }

  _checkDateRange (begin, end) {
    const rangeIsUnderWeek = !begin.clone().add(1, 'week').isBefore(end)
    const rangeIsUnderMonth = !begin.clone().add(1, 'month').isBefore(end)
    const resolutionTypeKey = this.props.resolutionType.get('type')
    if (rangeIsUnderWeek) {
      this.resolutionTypes = takeWhile(this.allResolutionTypes, (t) => t.type === 'day')
      if (resolutionTypeKey === 'week' || resolutionTypeKey === 'month') {
        this._setFilter('resolutionType', Map({name: 'Display daily', type: 'day'}))
      }
    } else if (rangeIsUnderMonth) {
      this.resolutionTypes = takeWhile(this.allResolutionTypes, (t) => t.type !== 'month')
      if (resolutionTypeKey === 'month') {
        this._setFilter('resolutionType', Map({name: 'Display weekly', type: 'week'}))
      }
    } else {
      this.resolutionTypes = clone(this.allResolutionTypes)
    }
    this._getNewGraphData()
    this._getNewTableData()
  }

  _teamChange (team = '') {
    return () => {
      this.props.setFilterMttaMttr({selectedTeam: team})
      this._getNewGraphData()
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
        <i className='fal fa-users' />
        <span className='filter--team-label-text'>{_truncate(selectedTeamName, 16)}</span>
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
    const ResolutionTypeDropdownLabel = <span>{this.props.resolutionType.get('name')}&nbsp;&nbsp;&nbsp;&nbsp;<i className='fa fa-angle-down' /></span>
    const YAxisTypeDropdownLabel = <span>{this.props.yAxisType.get('name')}&nbsp;&nbsp;&nbsp;&nbsp;<i className='fa fa-angle-down' /></span>

    return (
      <div className='reports--filter clearfix'>
        <div className='reports--teamsegment reports--filteritem'>
          { this._renderTeamsDropdown() }
        </div>

        <div className='reports--teamsegment reports--filteritem'>
          <div className='dropdown filter--dropdown-div'>
            <MultiSelectDropdown
              customInputClasses={['reports--filter--multi-select-dropdown']}
              iconClasses={['fal', 'fa-key']}
              placeholder={'route key'}
              filterName={'key'}
              options={this.props.routeKeys.toJS()}
              onChange={(items) => { this.props.setRouteKeysMttaMttr(items) }} />
          </div>
        </div>

        <div className='reports--daterange reports--filteritem'>
          <div className='reports--filter_dateselector'>
            <div className='row margin-0'>
              <div className='col-xs-10 margin-right-10'>
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
                  }}
                />
              </div>

              <div className='col-xs-2'>
                <Dropdown
                  dropdownItems={this.resolutionTypes}
                  labelComponent={ResolutionTypeDropdownLabel}
                  triggerClasses={['btn', 'btn-secondary', 'dropdown-btn']}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='reports--yaxistype reports--filteritem'>
          <div className='dropdown filter--dropdown-div'>
            <Dropdown
              dropdownItems={this.yAxisTypes}
              labelComponent={YAxisTypeDropdownLabel}
              triggerClasses={['btn', 'btn-secondary', 'dropdown-btn']}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(mttaMttrFilter)
