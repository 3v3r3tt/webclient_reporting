import React, { Component } from 'react'
import { withRouter } from 'react-router'
import Header from 'reporting/components/header'
import Footer from 'reporting/components/footer'
import IframeProfile from '../../components/iframe-profile'

function renderChildren (props) {
  return React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      children: props.children,
      location: props.location,
      router: props.router,
      featureFlags: props.state.meta
    })
  })
}

class MainWrapper extends Component {
  componentWillMount () {
    const {
      getOrgMeta
    } = this.props.actions.meta

    getOrgMeta()
  }

  render () {
    const {
      auth,
      meta,
      iframeModal
    } = this.props.state

    return (
      <div>
        <Header
          meta={meta}
          router={this.props.router}
          auth={auth}
          modalActions={this.props.actions.iframemodal}
        />
        { (iframeModal.get('open', false)) ? <IframeProfile modalActions={this.props.actions.iframemodal} auth={auth} /> : null }

        <main
          role='main'
          className='content-wrapper clearfix'>
          { renderChildren(this.props) }
        </main>
        <Footer />
      </div>
    )
  }
}

export default withRouter(MainWrapper)
