import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from './form'
import Sidebar from './sidebar'

import {
  getPostMortem
} from 'reporting/actions/post-mortem'

function mapStateToProps (state) {
  return {
    auth: state.auth,
    postmortem: state.postMortem
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getPostMortem: (payload) => dispatch(getPostMortem(payload))
  }
}

// TODO dumb component?
class PostMortem extends Component {
  componentWillMount () {
    const slug = this.props.params.slug
    if (slug) {
      const payload = { reportId: slug }
      this.props.getPostMortem(payload)
    }
  }

  render () {
    return (
      <div className='js-content-wrapper content-wrapper'>
        <div className='post-mortem-single--container clearfix'>
          <div className='post-mortemedit--container'>
            <div className='post-mortem--wrapper'>
              <div className='view-section post-mortem-single'>
                <div className='post-mortem--hero'>
                  <Form
                    auth={this.props.auth}
                    postmortem={this.props.postmortem}
                    location={this.props.location}
                   />
                </div>
                <div id='post-mortem--wrapper' className='hidden-fade post-mortem--wrapper clearfix'>
                  <div id='post-mortem--main' className='post-mortem--main'>
                    <div className='js-region-container'>
                      <div className='js-post-mortem-report'>
                        <span>Timeline to go here</span>
                      </div>
                      <div className='js-post-mortem-footer' />
                    </div>
                    <div className='post-mortem--sidebar_container' id='post-mortem--sidebar_container' >
                      <Sidebar />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostMortem)
