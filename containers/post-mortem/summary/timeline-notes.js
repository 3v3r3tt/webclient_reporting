// vendor
import React, {
    PureComponent
} from 'react'

import scrollTo from 'components/__utils/scrollTo'
import moment from 'moment'
import _ from 'lodash'

// TODO consider using timline notes
export default class TimelineNotes extends PureComponent {
  constructor (props) {
    super(props)

    this.showUnnavigableTimelineWarning = this.props.showUnnavigableTimelineWarning.bind(this)
  }

  scrollToLocation (timelineNote) {
    try {
      const targetId = `timeline-note-anchor-${timelineNote.get('sequence')}`
      let element = document.getElementById(targetId)
      let scrollTarget = element.offsetTop
      const postMortemHeroElement = document.getElementsByClassName('post-mortemsummary--timeline')[0].offsetTop
      scrollTarget += postMortemHeroElement
      scrollTo(document, scrollTarget, 600)
    } catch (e) {
      this.showUnnavigableTimelineWarning()
    }
  }

  isScrollable (note) {
    return this.props.report.get('timeline', [])
            .some(x => x.get('sequence', 0) === note.get('sequence'))
  }

  _getTimelineNoteContents () {
    // Determines if the long form date is needed
    const timelineNotes = this.props.timelineNotes
    const start = moment(this.props.report.getIn(['report', 'begin']))
    const end = moment(this.props.report.getIn(['report', 'end']))
    const spansMultipleDays = !start.isSame(end, 'date')

    // Generates the timestamp
    const TimelineNotes = timelineNotes.map((timelineNote) => {
      let timeStamp
      if (spansMultipleDays) {
        timeStamp = moment(timelineNote.get('timeStamp')).format('h:mm A - MMM D, YYYY')
      } else {
        timeStamp = moment(timelineNote.get('timeStamp')).format('h:mm A')
      }

      // Verifies that the timeline note is inside the date range
      if (timelineNote.get('timeStamp') === 'N/A') {
        return
      }

      const isScrollable = this.isScrollable(timelineNote)
      const scrollToNote = () => this.scrollToLocation(timelineNote)
      let LinkElement = <span onClick={scrollToNote} className='hoverable'>{timeStamp}</span>
      if (isScrollable) {
        LinkElement = <a onClick={scrollToNote} className='link--default'>{timeStamp}</a>
      }

      return (
        <div key={timelineNote.get('sequence')} className='row no-gutters post-mortem--timelinenotes--item'>
          <div className='col-3'>
            {LinkElement}
          </div>
          <div className='col-9'>
            <span
              className='post-mortemsummary--eventSummary'
              dangerouslySetInnerHTML={{__html: timelineNote.get('rendered')}}
            />
          </div>
        </div>
      )
    })
    return (<div>{TimelineNotes}</div>)
  }

  notesContainedInTimeline () {
    let hasSome = null
    const timelineNotes = this.props.timelineNotes.toJS()
    if (!timelineNotes || timelineNotes.length === 0) {
      return false
    } else {
      timelineNotes.forEach((note) => {
        if (!hasSome) {
          hasSome = _.some(this.props.timeline, (timelineItem) => {
            return timelineItem.get('sequence') === note.sequence
          })
        }
      })
      return hasSome
    }
  }

  render () {
    if (this.notesContainedInTimeline()) {
      return (
        <div className='post-mortem--timelinenotes'>
          <div className='page-header'>
            <h4 className='post-mortemsummary--header text--bold heading-5'>Timeline notes</h4>
          </div>
          { this._getTimelineNoteContents()}
        </div>
      )
    } else {
      return (
        <div className='post-mortem--timelinenotes' />
      )
    }
  }
}
