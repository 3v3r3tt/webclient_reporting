import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { BreadCrumbs } from '@victorops/victory'

import List from './list'
import { getPostMortems } from 'reporting/actions/post-mortems'
import { getUsers } from 'reporting/actions/users'

function mapStateToProps (state) {
  return {
    postMortems: state.postMortems,
    users: state.users,
    ...state
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getPostMortems: (payload) => dispatch(getPostMortems(payload)),
    getUsers: (payload) => dispatch(getUsers(payload))
  }
}

class PostMortems extends Component {
  componentDidMount () {
    this.props.getPostMortems()
    this.props.getUsers()
  }

  render () {
    const orgslug = this.props.auth.config.get('orgslug', '')
    const ReportHomeLink = <Link className='link--default' to={`/reports/${orgslug}`}>Reports</Link>
    return (
      <div className='container module-wrapper'>
        <BreadCrumbs breadcrumbs={[
          {label: ReportHomeLink, active: true},
          {label: 'Post Mortems', uri: '#reports/post-mortems', active: true}
        ]} light />

        <div id='post-mortem--table' className='post-mortem--table' >
          <List
            showLoader={this.props.postMortems.get('isLoading')}
            postmortems={this.props.postMortems.get('data')}
            users={this.props.users}
            orgslug={orgslug}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostMortems)
