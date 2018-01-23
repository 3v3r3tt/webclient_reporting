// vendor
import React, {
    PureComponent
} from 'react'

export default class EventSummary extends PureComponent {
  render () {
    let eventSummary = this.props.report.getIn(['report', 'rendered'], '')

    // Checks for empty event summary
    if (!eventSummary) {
      return (
        <div className='post-mortemsummary-events' />
      )
    }

    return (
      <div className='post-mortemsummary-events'>
        <div className='page-header'>
          <h4 className='post-mortemsummary--header text--bold heading-5'>Event summary</h4>
        </div>
        <div
          className='post-mortemsummary--eventSummary'
          dangerouslySetInnerHTML={{__html: eventSummary}}
        />
      </div>
    )
  }
}
