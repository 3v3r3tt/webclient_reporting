import React, { Component } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'
import { Map } from 'immutable'
import {
  clone,
  takeWhile
} from 'lodash'
import _truncate from 'util/truncate'

import IncidentFrequencyCSVButton from './csvDownloadButton'

import {
  Dropdown,
  DateRangePicker
} from '@victorops/victory'

import { getTeams } from 'reporting/actions/teams'

import {
  incidentFrequencyFilterUpdate,
  incidentFrequencyGraphGet,
  incidentFrequencyTableGet,
  incidentFrequencyInnerTableReset,
  incidentFrequencyTableReduce,
  incidentFrequencyTableReset
} from 'reporting/actions/incident-frequency'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faChartArea
} from '@fortawesome/fontawesome-pro-solid'
import { faUsers } from '@fortawesome/fontawesome-pro-light'

function mapStateToProps (state) {
  return {
    teams: state.teams,
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate'),
    chartType: state.incidentFrequency.get('chartType'),
    segmentationType: state.incidentFrequency.get('segmentationType'),
    resolutionType: state.incidentFrequency.get('resolutionType')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTeams: (payload) => dispatch(getTeams(payload)),
    setFilterIncidentFrequency: (payload) => dispatch(incidentFrequencyFilterUpdate(payload)),
    getTeamIncidentFrequencyGraph: (payload) => dispatch(incidentFrequencyGraphGet(payload)),
    getInnerIncidentFrequencyTable: (payload) => dispatch(incidentFrequencyTableGet(payload)),
    resetInnerIncidentFrequencyTable: (payload) => dispatch(incidentFrequencyInnerTableReset(payload)),
    updateReducedTable: (payload) => dispatch(incidentFrequencyTableReduce(payload)),
    resetReducedTable: (payload) => dispatch(incidentFrequencyTableReset(payload))
  }
}

class IncidentFrequencyFilter extends Component {
  constructor (props) {
    super(props)

    this.chartTypes = [
      { label: 'Line',
        handleClick: () => {
          this._setFilter('chartType', Map({label: 'Line', key: 'Line'}))
          this.props.resetReducedTable()
        }
      },
      { label: 'Area',
        handleClick: () => {
          this._setFilter('chartType', Map({label: 'Area', key: 'Area'}))
          this.props.resetReducedTable()
        }
      },
      { label: 'Column',
        handleClick: () => {
          this._setFilter('chartType', Map({label: 'Column', key: 'Column'}))
          this.props.resetReducedTable()
        }
      }
    ]

    this.segmentationTypes = [
      {
        label: 'Segment by host',
        handleClick: () => {
          this._setFilter('segmentationType', Map({
            name: 'Segment by host',
            label: 'Host',
            key: 'host'
          }))
        }
      },
      {
        label: 'Segment by integration',
        handleClick: () => {
          this._setFilter('segmentationType', Map({
            name: 'Segment by integration',
            label: 'Integration',
            key: 'monitor'
          }))
        }
      },
      {
        label: 'Segment by route key',
        handleClick: () => {
          this._setFilter('segmentationType', Map({
            name: 'Segment by route key',
            label: 'Route Key',
            key: 'route_key'
          }))
        }
      },
      {
        label: 'Segment by service',
        handleClick: () => {
          this._setFilter('segmentationType', Map({
            name: 'Segment by service',
            label: 'Service',
            key: 'service'
          }))
        }
      }
    ]

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

    this._beginDateChange = this._beginDateChange.bind(this)
    this._endDateChange = this._endDateChange.bind(this)
    this._isValidEndDate = this._isValidEndDate.bind(this)
    this._isValidBeginDate = this._isValidBeginDate.bind(this)
    this._checkDateRange = this._checkDateRange.bind(this)
    this._setFilter = this._setFilter.bind(this)
  }

  componentDidMount () {
    this.props.getTeams()
    this._getNewTableData()
  }

  _getNewTableData () {
    this.props.getTeamIncidentFrequencyGraph()
  }

  _setFilter (type, value) {
    const payload = {[type]: value}
    this.props.setFilterIncidentFrequency(payload)
    this._getNewTableData()
  }

  _endDateChange (momentDate) {
    const date = momentDate.utc().endOf('day')
    this.props.setFilterIncidentFrequency({endDate: date.valueOf()})
    this._checkDateRange(moment(this.props.beginDate), date)
  }

  _beginDateChange (momentDate) {
    const date = momentDate.utc().startOf('day')
    this.props.setFilterIncidentFrequency({beginDate: date.valueOf()})
    this._checkDateRange(date, moment(this.props.endDate))
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
    this._getNewTableData()
  }

  _teamChange (team = '') {
    return () => {
      this.props.setFilterIncidentFrequency({selectedTeam: team})
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
    const ServiceDropdownLabel = <span>{this.props.segmentationType.get('name')}&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faAngleDown} /></span>
    const ChartTypeDropdownLabel = <span><FontAwesomeIcon icon={faChartArea} />&nbsp;&nbsp;{this.props.chartType.get('label')} &nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faAngleDown} /></span>
    const ResolutionTypeDropdownLabel = <span>{this.props.resolutionType.get('name')}&nbsp;&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faAngleDown} /></span>

    return (
      <div className='reports--filter clearfix'>
        <div className='reports--teamsegment reports--filteritem'>
          { this._renderTeamsDropdown() }
          <div className='reports--filter-type'>
            <Dropdown
              dropdownItems={this.segmentationTypes}
              labelComponent={ServiceDropdownLabel}
              triggerClasses={['btn', 'btn-secondary', 'dropdown-btn']}
            />
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

        <div className='reports--charttype reports--filteritem'>
          <div className='reports--filter-type'>
            <Dropdown
              dropdownItems={this.chartTypes}
              labelComponent={ChartTypeDropdownLabel}
              triggerClasses={['btn', 'btn-secondary', 'dropdown-btn']}
            />
          </div>
        </div>

        <div className='reports--exportcsv reports--filter_csv'>
          <div className='reports--filter-type'>
            <IncidentFrequencyCSVButton {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyFilter)
