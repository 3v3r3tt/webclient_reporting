import React from 'react'

import moment from 'moment'

import OnCallDownloadCSVRow from './onCallDownloadCSVRow'

import Victory from '@victorops/victory'

const { Table } = Victory

const ON_CALL_LIMIT = 100

class HoursOnCallTable extends React.Component {
  _roundToNearestMinute (unroundedMoment) {
    if (unroundedMoment.seconds() >= 30) {
      return unroundedMoment.add(1, 'minute')
    } else {
      return unroundedMoment
    }
  }

  _isFullDay (duration) {
    return duration.days() === 1 || duration.hours() + duration.minutes() + duration.seconds() === 0
  }

  _renderDownloadCSVRow () {
    return {
      id: 'incidentsSeeMore',
      columns: [{
        content: '',
        value: 'ALWAYS_ON_BOTTOM',
        id: 'placeholder1',
        type: 'cell'
      },
      {
        content: '',
        value: 'ALWAYS_ON_BOTTOM',
        id: 'placeholder2',
        type: 'cell'
      },
      {
        component: OnCallDownloadCSVRow,
        id: 'downloadCSV',
        content: {
          type: 'on-call data',
          endpoint: 'oncall_csv',
          beginDate: this.props.beginDate,
          endDate: this.props.endDate,
          selectedTeam: this.props.selectedTeam,
          selectedUser: this.props.selectedUser
        },
        type: 'component',
        value: 'ALWAYS_ON_BOTTOM'
      },
      {
        content: '',
        value: 'ALWAYS_ON_BOTTOM',
        id: 'placeholder3',
        type: 'cell'
      },
      {
        content: '',
        value: 'ALWAYS_ON_BOTTOM',
        id: 'placeholder4',
        type: 'cell'
      }]
    }
  }

  _generateUserOnCallRows () {
    const showableOnCalls = this.props.segmentedOnCalls.slice(0, ON_CALL_LIMIT)
    const generatedRows = showableOnCalls.map((onCallPeriod, index) => {
      const onCallStartTime = this._roundToNearestMinute(moment(onCallPeriod.get('start_epoch')))
      const onCallEndTime = this._roundToNearestMinute(moment(onCallPeriod.get('end_epoch')))

      const onCallDate = moment(onCallPeriod.get('start_epoch')).format('MMM. D, YYYY')
      const onCallDuration = moment.duration(onCallEndTime.diff(onCallStartTime))
      const hours = this._isFullDay(onCallDuration) ? 24 : onCallDuration.hours()
      const minutes = onCallDuration.minutes() < 10 ? `0${onCallDuration.minutes()}` : onCallDuration.minutes()
      const endDurationTime = onCallEndTime.hours() === 0 ? '24:00' : onCallEndTime.format('HH:mm')
      const durationText = `${hours}:${minutes} (${onCallStartTime.format('HH:mm')} - ${endDurationTime})`
      const shiftText = onCallPeriod.get('shift_name') ? `(${onCallPeriod.get('shift_name')})` : ''

      return ({
        id: index,
        columns: [{
          content: onCallDate,
          value: onCallPeriod.get('start_epoch', 0),
          id: 'date',
          type: 'cell'
        },
        {
          content: durationText,
          value: onCallDuration,
          id: 'duration',
          type: 'cell'
        },
        {
          content: onCallPeriod.get('escalation_policy_name', ''),
          value: onCallPeriod.get('escalation_policy_name', 'ZZ'),
          id: 'policy',
          type: 'cell'
        },
        {
          content: `${onCallPeriod.get('rotation_name', '')} ${shiftText}`,
          value: onCallPeriod.get('rotation_name', 'ZZ'),
          id: 'rotation',
          type: 'cell'
        },
        {
          content: onCallPeriod.get('override', ''),
          value: onCallPeriod.get('override', 'ZZ'),
          id: 'override',
          type: 'cell'
        }]
      })
    })

    if (this.props.segmentedOnCalls.size > ON_CALL_LIMIT) {
      return generatedRows.push(this._renderDownloadCSVRow()).toJS()
    } else {
      return generatedRows.toJS()
    }
  }

  render () {
    const generatedRows = this._generateUserOnCallRows()
    const userOnCallTableConfig = {
      columnHeaders: [
        {
          label: 'Date',
          isSortable: true
        },
        {
          label: 'Time On-call',
          isSortable: true
        },
        {
          label: 'Esc. Policy',
          isSortable: true
        },
        {
          label: 'Rotation',
          isSortable: true
        },
        {
          label: 'On-call Override',
          isSortable: true
        }],
      rowItems: generatedRows,
      customClasses: generatedRows.length > ON_CALL_LIMIT ? ['on-call--user-hours--table'] : []
    }

    return (
      <div className='oncall--user_hours'>
        <h5>Hours on-call ({this.props.totalHours})</h5>
        <p>"On-call" means the person was on the first step in an escalation policy.</p>

        <div className='has-loading-gradient'>
          <Table {...userOnCallTableConfig} showLoader={this.props.isLoading} />
          {(!this.props.isLoading && !this.props.segmentedOnCalls.size) ? <p>No data found</p> : null}
        </div>
      </div>
    )
  }
}

export default HoursOnCallTable
