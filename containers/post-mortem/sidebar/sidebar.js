import React from 'react'

import { connect } from 'react-redux'

import {
  createPostMortemActionItem,
  removePostMortemActionItem
} from 'reporting/actions/post-mortem'

import {
  showModal,
  hideModal
} from 'reporting/actions/modal'

import ActionList from './action-items'
import TimelineNotes from './timeline-notes'

import _ from 'lodash'

function mapStateToProps (state, ownProps) {
  return {
    report: state.postMortem.get('report'),
    actionItems: state.postMortem.get('actionItems'),
    timelineNotes: state.postMortem.get('timelineNotes')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => dispatch(hideModal()),
    showModal: (modalConfig) => dispatch(showModal(modalConfig)),
    createActionItem: (payload) => dispatch(createPostMortemActionItem(payload)),
    removeActionItem: (payload) => dispatch(removePostMortemActionItem(payload))
  }
}

class PostMortemSideBar extends React.Component {
  constructor (props) {
    super(props)

    this.showAddActionItem = this.showAddActionItem.bind(this)
    this.showRemoveActionItem = this.showRemoveActionItem.bind(this)
    this.showUnnavigableTimelineWarning = this.showUnnavigableTimelineWarning.bind(this)
  }

  showUnnavigableTimelineWarning () {
    const scrollToBottom = () => {
      this.props.hideModal()
      window.scrollTo(0, document.body.scrollHeight)
    }
    const modalConfig = {
      modalType: 'confirm',
      modalProps: {
        title: 'Ut-oh',
        body: 'This timeline note has not yet been loaded. Please scroll to the bottom to load more timeline before trying to navigate here.',
        onCancel: () => this.props.hideModal(),
        cancelButtonText: 'Close',
        onConfirm: scrollToBottom,
        confirmButtonText: 'Jump to Bottom',
        confirmButtonType: 'primary'
      }
    }
    this.props.showModal(modalConfig)
  }

  showAddActionItem () {
    this.isSavingActionItem = false // TODO: revisit need for flag here, seems related to backbone zombie views
    let addActionItemPayload = {
      reportId: this.props.report.get('id'),
      actionItemToAdd: { body: '' },
      success: this.props.hideModal
    }

    const handleActionItemDescriptionChange = (e) => {
      const body = e.target.value
      addActionItemPayload.actionItemToAdd = { body: body }
    }

    const ActionItemDescription = <textarea
      placeholder='Action item description'
      className='post-mortem--action-items--add-action-item-input'
      onChange={handleActionItemDescriptionChange}
      autoFocus
      />

    const createActionItem = () => {
      if (addActionItemPayload.actionItemToAdd.body && !this.isSavingActionItem) {
        this.isSavingActionItem = true
        this.props.createActionItem(addActionItemPayload)
        addActionItemPayload.actionItemToAdd.body = ''
      }
    }

    const modalConfig = {
      modalType: 'confirm',
      modalProps: {
        title: 'Add action item',
        component: ActionItemDescription,
        onCancel: () => this.props.hideModal(),
        onConfirm: createActionItem,
        confirmButtonType: 'info',
        confirmButtonText: 'Add'
      }
    }

    this.props.showModal(modalConfig)
  }

  showRemoveActionItem (actionItemIdToRemove) {
    const removeActionItem = () => {
      const payload = {
        reportId: this.props.report.get('id'),
        actionItemIdToRemove: actionItemIdToRemove,
        success: this.props.hideModal
      }
      this.props.removeActionItem(payload)
    }

    const modalConfig = {
      modalType: 'confirm',
      modalProps: {
        title: 'Delete action item',
        body: 'Are you should you would like to delete this action item?',
        onCancel: () => this.props.hideModal(),
        onConfirm: _.once(removeActionItem), // TODO: revisit use of _.once here, seems related to backbone zombie views
        confirmButtonType: 'danger',
        confirmButtonText: 'Delete'
      }
    }

    this.props.showModal(modalConfig)
  }

  render () {
    let timeline = _.clone(this.props.report.toJS().timeline)
    return (
      <div className='post-mortem--sidebar' id='post-mortem--sidebar'>
        <TimelineNotes
          timelineNotes={this.props.timelineNotes}
          report={this.props.report}
          showUnnavigableTimelineWarning={this.showUnnavigableTimelineWarning}
          timeline={timeline}
        />

        <hr className='post-mortem--sidebar--bar' />

        <ActionList
          actionItems={this.props.actionItems}
          showAddActionItem={this.showAddActionItem}
          showRemoveActionItem={this.showRemoveActionItem}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostMortemSideBar)
