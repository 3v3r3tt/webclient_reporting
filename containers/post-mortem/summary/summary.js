// vendor
import React from 'react'
// Export
// ---------------------------------------------------------------------------

import {
  connect
} from 'react-redux'

import {
  showModal,
  hideModal
} from 'reporting/actions/modal'

import {
  getPostMortemActionItems,
  getPostMortemTimelineNotes
} from 'reporting/actions/post-mortem'

import Header from './header'
import EventSummary from './event-summary'
import TimelineNotes from './timeline-notes'
import ActionItems from './actions-items'

function mapStateToProps (state, ownProps) {
  return {
    report: state.postMortem,
    timelineNotes: state.postMortem.get('timelineNotes'),
    actionItems: state.postMortem.get('actionItems')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: () => dispatch(hideModal()),
    showModal: (modalConfig) => dispatch(showModal(modalConfig)),
    getActionItems: (payload) => dispatch(getPostMortemActionItems(payload)),
    getTimelineNotes: (payload) => dispatch(getPostMortemTimelineNotes(payload))
  }
}

class PostMortemSummary extends React.Component {
  constructor (props) {
    super(props)

    this.showUnnavigableTimelineWarning = this.showUnnavigableTimelineWarning.bind(this)
  }
  componentWillMount () {
    const payload = { reportId: this.props.slug }
    this.props.getActionItems(payload)
    this.props.getTimelineNotes(payload)
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

  render () {
    let timeline = this.props.report.toJS().timeline
    return (
      <div>
        <Header report={this.props.report} />
        <EventSummary report={this.props.report} />
        <TimelineNotes
          timelineNotes={this.props.timelineNotes}
          report={this.props.report}
          timeline={timeline}
          showUnnavigableTimelineWarning={this.showUnnavigableTimelineWarning} />
        <ActionItems actionItems={this.props.actionItems} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostMortemSummary)
