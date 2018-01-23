import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  mttaMttrGoalSetMtta,
  mttaMttrGoalSetMttr
} from 'reporting/actions/mtta-mttr'

import {
  hideModal,
  showModal
} from 'reporting/actions/modal'

import GoalsModal from './goalsModal'

function mapStateToProps (state) {
  return {
    mtta: state.mttaMttr.getIn(['graphData', 'tta_period_avg'], 0),
    mttr: state.mttaMttr.getIn(['graphData', 'ttr_period_avg'], 0),
    incidents: state.mttaMttr.getIn(['graphData', 'total_incidents'], 0),
    mttaGoal: state.mttaMttr.getIn(['goals', 'mtta'], null),
    mttrGoal: state.mttaMttr.getIn(['goals', 'mttr'], null)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setMttaGoal: (payload) => dispatch(mttaMttrGoalSetMtta(payload)),
    setMttrGoal: (payload) => dispatch(mttaMttrGoalSetMttr(payload)),
    hideModal: (payload) => dispatch(hideModal(payload)),
    showModal: (payload) => dispatch(showModal(payload))
  }
}

class mttaMttrGoals extends Component {
  _transformTime (time) {
    const minutes = Math.round(time / 60)
    if (minutes === 1) return minutes.toString() + ' min'
    else return minutes.toString() + ' mins'
  }

  _openGoalModal (type, value, title, text) {
    const modalConfig = {
      modalType: 'confirm',
      modalProps: {
        actionBar: false,
        title: title,
        component: <GoalsModal value={value} text={text} type={type} />,
        onCancel: () => this.props.hideModal(),
        cancelButtonText: 'Cancel',
        cancelButtonType: 'secondary',
        confirmButtonText: 'Add Goal',
        confirmButtonType: 'info',
        modalClass: 'mtta-mttr--goal-modal'
      }
    }

    this.props.showModal(modalConfig)
  }

  _goal (type, value, title, text) {
    const duration = moment.duration(value)
    const addGoalText = value ? 'Goal: ' + Math.floor(duration.asDays()) + 'd ' + duration.hours() + 'h ' + duration.minutes() + 'm ' : 'add goal'

    const modalText =
      <a
        onClick={() => this._openGoalModal(type, value, title, text)}>
        {addGoalText}
      </a>

    return <span> ({modalText})</span>
  }

  _deleteButton (type) {
    let value = null
    let deleteFunc = null
    if (type === 'mtta') {
      value = this.props.mttaGoal
      deleteFunc = () => { this.props.setMttaGoal({mtta: null}) }
    } else if (type === 'mttr') {
      value = this.props.mttrGoal
      deleteFunc = () => { this.props.setMttrGoal({mttr: null}) }
    }

    const deleteButton = <span onClick={deleteFunc} className='mtta-mttr--goals--goal--delete'> <i className='far fa-times' /></span>
    return value ? deleteButton : null
  }

  render () {
    const mtta = this._transformTime(this.props.mtta)
    const mttr = this._transformTime(this.props.mttr)

    const addMttaGoal = this._goal(
      'mtta',
      this.props.mttaGoal,
      'Add Time-To-ACK Goal',
      'This will show the number of ACKs within your stated goal.'
    )

    const addMttrGoal = this._goal(
      'mttr',
      this.props.mttrGoal,
      'Add Time-To-RES Goal',
      'This will show the number of RESs within your stated goal.'
    )

    return (
      <div className='mtta-mttr--goals'>
        <span className='mtta-mttr--goals--goal'>
          <strong>MTTA: </strong>
          {mtta}
          {this._deleteButton('mtta')}
          {addMttaGoal}
        </span>
        <span className='mtta-mttr--goals--goal'>
          <strong>MTTR: </strong>
          {mttr}
          {this._deleteButton('mttr')}
          {addMttrGoal}
        </span>
        <span className='mtta-mttr--goals--goal'>
          <strong>Incidents: </strong>
          {this.props.incidents}
        </span>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(mttaMttrGoals)
