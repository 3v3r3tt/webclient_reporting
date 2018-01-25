import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  mttaMttrGoalSetMtta,
  mttaMttrGoalSetMttr
} from 'reporting/actions/mtta-mttr'

import {
  hideModal
} from 'reporting/actions/modal'

import Victory from '@victorops/victory'
const { Button } = Victory

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    setMttaGoal: (payload) => dispatch(mttaMttrGoalSetMtta(payload)),
    setMttrGoal: (payload) => dispatch(mttaMttrGoalSetMttr(payload)),
    hideModal: (payload) => dispatch(hideModal(payload))
  }
}

class GoalsModal extends Component {
  componentDidMount () {
    const duration = moment.duration(this.props.value)
    if (Math.floor(duration.asDays()) > 0) {
      this._daysInput.value = Math.floor(duration.asDays())
    }
    if (duration.hours() > 0) {
      this._hoursInput.value = duration.hours()
    }
    if (duration.minutes()) {
      this._minutesInput.value = duration.minutes()
    }
  }

  _modalOnConfirm () {
    const days = this._daysInput.value || null
    const hours = this._hoursInput.value || null
    const minutes = this._minsInput.value || null

    let duration = moment.duration(0)
      .add(parseInt(days), 'days')
      .add(parseInt(hours), 'hours')
      .add(parseInt(minutes), 'minutes')

    if (this.props.type === 'mtta') this.props.setMttaGoal({mtta: duration.valueOf()})
    else if (this.props.type === 'mttr') this.props.setMttrGoal({mttr: duration.valueOf()})
    this.props.hideModal()
  }

  render () {
    return (
      <div>
        <div>{this.props.text}</div>
        <div className='mtta-mttr--goal-modal--form'>
          <input
            type='number'
            placeholder='Days'
            min={0}
            className='mtta-mttr--goal-modal--form--input'
            ref={(input) => { this._daysInput = input }} />
          <input
            type='number'
            placeholder='Hours'
            min={0}
            className='mtta-mttr--goal-modal--form--input'
            ref={(input) => { this._hoursInput = input }} />
          <input
            type='number'
            placeholder='Minutes'
            min={0}
            className='mtta-mttr--goal-modal--form--input'
            ref={(input) => { this._minsInput = input }} />
        </div>
        <div className='mtta-mttr--goal-modal--btn-row'>
          <Button
            content='Cancel'
            type='btn-secondary mtta-mttr--goal-modal--btn-row--cancel'
            clickHandler={() => { this.props.hideModal() }}
          />
          <Button
            content='Add Goal'
            type='btn-outline-primary mtta-mttr--goal-modal--btn-row--confirm'
            clickHandler={() => { this._modalOnConfirm() }}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoalsModal)
