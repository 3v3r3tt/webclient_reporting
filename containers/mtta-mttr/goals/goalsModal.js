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

import { Button } from '@victorops/victory'

const GOAL_LIMIT = 100

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
  constructor (props) {
    super(props)

    this.state = {
      error: null,
      daysError: false,
      hoursError: false,
      minutesError: false
    }
  }

  componentDidMount () {
    const duration = moment.duration(this.props.value)
    if (Math.floor(duration.asDays()) > 0) {
      this._daysInput.value = Math.floor(duration.asDays())
    }
    if (duration.hours() > 0) {
      this._hoursInput.value = duration.hours()
    }
    if (duration.minutes()) {
      this._minsInput.value = duration.minutes()
    }
  }

  _handleSizeError (duration) {
    const durationIsTooBig = duration.asDays() > GOAL_LIMIT

    const errorMessage = durationIsTooBig ? 'Invalid goal (max 100 days)' : null

    this.setState({
      error: errorMessage
    })

    return durationIsTooBig
  }

  _handleSizeErrorWrapper () {
    const days = Number(this._daysInput.value) || 0
    const hours = Number(this._hoursInput.value) || 0
    const minutes = Number(this._minsInput.value) || 0

    let duration = moment.duration(0)
      .add(parseInt(days), 'days')
      .add(parseInt(hours), 'hours')
      .add(parseInt(minutes), 'minutes')

    this._handleSizeError(duration)
  }

  _modalOnConfirm () {
    const days = Number(this._daysInput.value) || 0
    const hours = Number(this._hoursInput.value) || 0
    const minutes = Number(this._minsInput.value) || 0

    const durationIsNonPositive = minutes + hours * 60 + days * 1440 <= 0

    let duration = moment.duration(0)
      .add(parseInt(days), 'days')
      .add(parseInt(hours), 'hours')
      .add(parseInt(minutes), 'minutes')

    if (durationIsNonPositive) {
      this.setState({error: 'Invalid goal'})
    } else if (duration.asDays() > GOAL_LIMIT) {
      this._handleSizeError(duration)
    } else {
      if (this.props.type === 'mtta') this.props.setMttaGoal({mtta: duration.valueOf()})
      else if (this.props.type === 'mttr') this.props.setMttrGoal({mttr: duration.valueOf()})
      this.props.hideModal()
    }
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
            className={'mtta-mttr--goal-modal--form--input' + (this.state.error ? ' mtta-mttr--goal-modal--form--input--error' : '')}
            onBlur={() => this._handleSizeErrorWrapper()}
            ref={(input) => { this._daysInput = input }} />
          <input
            type='number'
            placeholder='Hours'
            min={0}
            className={'mtta-mttr--goal-modal--form--input' + (this.state.error ? ' mtta-mttr--goal-modal--form--input--error' : '')}
            onBlur={() => this._handleSizeErrorWrapper()}
            ref={(input) => { this._hoursInput = input }} />
          <input
            type='number'
            placeholder='Minutes'
            min={0}
            className={'mtta-mttr--goal-modal--form--input' + (this.state.error ? ' mtta-mttr--goal-modal--form--input--error' : '')}
            onBlur={() => this._handleSizeErrorWrapper()}
            ref={(input) => { this._minsInput = input }} />
        </div>
        <p className='mtta-mttr--goal-modal--error-message'>
          {this.state.error}
        </p>
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
