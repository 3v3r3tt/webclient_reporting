// vendor
import React, {
  PureComponent
} from 'react'

import scrollTo from 'components/__utils/scrollTo'
import moment from 'moment'
import _ from 'lodash'

export default class TimelineNotes extends PureComponent {
  constructor (props) {
    super(props)

    this.showUnnavigableTimelineWarning = this.props.showUnnavigableTimelineWarning.bind(this)
  }

  scrollToLocation (timelineNote) {
    try {
      const targetId = `timeline-note-anchor-${timelineNote.sequence}`
      let scrollTarget = document.getElementById(targetId).offsetTop
      const postMortemHeroElement = document.getElementsByClassName('post-mortem--hero')[0]
      if (postMortemHeroElement) {
        scrollTarget += postMortemHeroElement.offsetHeight
      }
      scrollTo(document, scrollTarget, 600)
    } catch (e) {
      this.showUnnavigableTimelineWarning()
    }
  }

  isScrollable (note) {
    return this.props.report.get('timeline', [])
      .some(x => x.get('sequence', 0) === note.sequence)
  }

  generateTimeStamp ({spansMultiple, unixTime}) {
    if (spansMultiple) {
      return moment(unixTime).format('h:mm A - MMM D, YYYY')
    } else {
      return moment(unixTime).format('h:mm A')
    }
  }

  generateTimelineNoteElements (timelineNotes) {
    timelineNotes = timelineNotes.toJS()
    const PlaceholderContent = <p><i>
      Hover over a moment in the timeline and click the note icon to add a Timeline note. Notes you add will also show here.
    </i></p>

    if (!timelineNotes.length) return PlaceholderContent

    const start = moment(this.props.report.getIn(['report', 'begin']))
    const end = moment(this.props.report.getIn(['report', 'end']))
    const spansMultipleDays = !start.isSame(end, 'date')

    const TimelineNotes = timelineNotes.map((timelineNote) => {
      let timeStamp
      if (timelineNote.timeStamp !== 'N/A') {
        const unixTimeStamp = timelineNote.timeStamp / 1000
        if (unixTimeStamp < start.unix() || unixTimeStamp > end.unix()) {
          return null // timeline note is now outside of report range
        }
        timeStamp = this.generateTimeStamp({
          spansMultiple: spansMultipleDays,
          unixTime: timelineNote.timeStamp
        })
        if (timeStamp === 'Invalid date') return null
      } else {
        // use this.props.timeline to determine note inclusion
        const noteIsInRange = _.find(this.props.timeline, (x) => {
          return x.get('sequence') === timelineNote.sequence
        })
        if (noteIsInRange) {
          timeStamp = this.generateTimeStamp({
            spansMultiple: spansMultipleDays,
            unixTime: noteIsInRange.get('serviceTime')
          })
        } else {
          return null
        }
      }

      const isScrollable = this.isScrollable(timelineNote)
      const scrollToNote = () => this.scrollToLocation(timelineNote)
      let LinkElement = <span onClick={scrollToNote} className='hoverable'>{timeStamp}</span>
      if (isScrollable) {
        LinkElement = <a onClick={scrollToNote}>{timeStamp}</a>
      }

      return (
        <div key={timelineNote.sequence} className={isScrollable ? '' : 'half-fade'}>
          <div className='post-mortem--sidebar_timestamp'>
            {LinkElement}
          </div>
          <div>
            <span
              className='post-mortemsummary--eventSummary'
              dangerouslySetInnerHTML={{__html: timelineNote.rendered}}
            />
          </div>
        </div>
      )
    })
    // range has been changed and now all notes are outside of range
    if (_.every(TimelineNotes, (note) => !note)) return PlaceholderContent

    return (<div>{TimelineNotes}</div>)
  }

  render () {
    const {
      timelineNotes
    } = this.props

    const TimelineNoteContent = this.generateTimelineNoteElements(timelineNotes)

    return (
      <div className='post-mortem--timelinenotes post-mortem--sidebar_section'>
        <h1 className='post-mortem--sidebar_header'>Timeline notes</h1>
        {TimelineNoteContent}
      </div>
    )
  }
}
