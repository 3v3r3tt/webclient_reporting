import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { BreadCrumbs } from '@victorops/victory'
import Summary from './summary'
import Timeline from './timeline'

import {
  getPostMortem
} from 'reporting/actions/post-mortem'

function mapStateToProps (state) {
  return {
    auth: state.auth,
    postmortem: state.postMortem
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    getPostMortem: (payload) => dispatch(getPostMortem(payload))
  }
}

class PostMortem extends Component {
  componentWillMount () {
    const payload = { reportId: this.props.params.slug }
    this.props.getPostMortem(payload)
  }

  _getBreadCrumbs () {
    const orgslug = this.props.auth.config.get('orgslug', '')
    const ReportHomeLink = <Link className='link--default' to={`/reports/${orgslug}`}>Reports</Link>
    const PIRS = <Link className='link--default' to={`/reports/${orgslug}/post-mortems`}>Post Incident Reviews</Link>

    return (
      <BreadCrumbs breadcrumbs={[
        {label: ReportHomeLink, active: true},
        {label: PIRS, uri: '#reports/post-mortems', active: true},
        {label: this.props.postmortem.getIn(['data', 'title'], ''), active: true}
      ]} light />
    )
  }

  render () {
    return (
      <div className='post-mortem-single--container clearfix'>
        <div className='post-mortemsummary--container'>
          <div className='post-mortemsummary--wrapper'>
            { this._getBreadCrumbs() }
            <div id='post-mortemsummary--content' className='post-mortemsummary--content' >
              <Summary
                slug={this.props.params.slug}
              />
            </div>
            <div className='post-mortemsummary--timeline' >
              <Timeline roomId={'*'} disableInfiniteScroll />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostMortem)
