import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from './form'
import Sidebar from './sidebar'
import Timeline from './timeline'

import {
  getPostMortem,
  resetPostMortem
} from 'reporting/actions/post-mortem'

function mapStateToProps (state) {
  return {
    auth: state.auth,
    postmortem: state.postMortem
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getPostMortem: (payload) => dispatch(getPostMortem(payload)),
    resetPostMortem: () => dispatch(resetPostMortem())
  }
}

// TODO dumb component?
class PostMortem extends Component {
  componentWillMount () {
    const slug = this.props.params.slug
    if (slug) {
      const payload = { reportId: slug }
      this.props.getPostMortem(payload)
    } else {
      this.props.resetPostMortem()
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
                  <div className='post-mortem--main '>
                    <div className='post-mortem--timeline_container col-8 pull-left'>
                      <Timeline roomId={'*'} />
                    </div>
                    <div className='post-mortem--sidebar_container col-4'>
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
