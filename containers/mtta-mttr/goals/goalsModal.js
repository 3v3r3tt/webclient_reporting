import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  mttaMttrGoalSetMtta,
  mttaMttrGoalSetMttr
} from 'reporting/actions/mtta-mttr'

function mapStateToProps (state) {
  return {
    goals: state.mttaMttr.get('goals')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setMttaGoal: (payload) => dispatch(mttaMttrGoalSetMtta(payload)),
    setMttrGoal: (payload) => dispatch(mttaMttrGoalSetMttr(payload))
  }
}

class GoalsModal extends Component {
  componentDidMount () {
    const value = this.props.value || ''
    this._input.focus()
    this._input.value = value
  }

  render () {
    return (
      <div>
        <div>{this.props.text}</div>
        <div className='mtta-mttr--goal-modal--form'>
          <input
            type='number'
            placeholder='Goal'
            className='mtta-mttr--goal-modal--form--input'
            id='mtta-mttr--goal-modal--form--input'
            ref={(input) => { this._input = input }} />
          <span> Minutes</span>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoalsModal)
