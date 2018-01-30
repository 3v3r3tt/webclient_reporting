// vendor
import React, {
  PureComponent
} from 'react'
import { browserHistory } from 'react-router'

import { unescape } from 'components/__utils/format'

import { Button } from '@victorops/victory'

let config = window.VO_CONFIG

export default class ActionList extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      loading: false
    }

    // Binding Print Functions
    this.load = this.load.bind(this)
    this.onPrint = this.onPrint.bind(this)
  }

  // Handles Initial Print Logic
  onPrint () {
    let collection = this.props.report.get('collection')

    if (collection.hasMore()) {
      this.setState({ loading: true })
      this.load()
    } else {
      window.print()
    }
  }

  // Handles Recursive Loading for Print Logic
  load () {
    let collection = this.props.report.get('collection')
    if (collection.hasMore()) {
      collection.loadMore().then(this.load)
    } else {
      this.setState({ loading: false })
      window.print()
    }
  }

  render () {
    // Header Data
    let title = this.props.report.getIn(['report', 'title'])
    let timerange = this.props.report.getIn(['report', 'timerange'])
    let reporter = this.props.report.getIn(['report', 'owner'])
    let customerImpacted = this.props.report.getIn(['report', 'is_customer_impacted'])

    // Editable Logic
    let isOwner = reporter === config.auth.user.username
    let editable = (isOwner || this.props.report.getIn(['report', 'can_edit'], false))

    return (
      <header className='post-mortem-header'>
        <div className='hidden-print btn-row'>
          { editable
            ? <Button
              content='Edit'
              type='btn-outline-primary'
              clickHandler={() => { browserHistory.push(browserHistory.getCurrentLocation().pathname + '/edit') }}
              />
            : null
          }
          <Button
            content='Print'
            type={'btn-secondary float-right' + (this.state.loading ? ' is-loading' : '')}
            clickHandler={() => this.onPrint()}
          />
        </div>
        <h3 className='post-mortemsummary--header post-mortemsummary--main'>{unescape(title)}</h3>
        <p className='text--small detail-view'><span className='text--bold'>Event date: </span>{unescape(timerange)}</p>
        <p className='text--small detail-view'>
          <span className='text--bold'>Customer impacted? </span>
          {!customerImpacted ? 'Yes' : 'No'}
        </p>
        <p className='text--small detail-view'><span className='text--bold'>Reporter: </span>{unescape(reporter)}</p>
      </header>
    )
  }
}
