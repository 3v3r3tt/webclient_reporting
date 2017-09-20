import React from 'react'

export default class Footer extends React.Component {
  constructor () {
    super()

    this.state = {
      helpIsOpen: false
    }
  }

  render () {
    const helpIsOpen = this.state.helpIsOpen
    const helpIsOpenClass = (helpIsOpen) ? 'open' : 'closed'

    return (
      <footer className='primary-footer'>
        <a href='/client/tron' target='' className='logged-in-brand' title='Return to your timeline'>
          <img className='vo-logo-graphic' src='/public/img/vo-logo-graphic.svg' />
          <img className='vo-logo-text' src='/public/img/vo-logo-text.svg' />
        </a>

        <ul className='primary-nav'>
          <li className='primary-nav-item download-mobile'>
            Download the mobile app →
            <a target='_blank' className='app-store' title='Download from App Store' href='https://itunes.apple.com/us/app/victorops/id696974262?ls=1&amp;mt=8'>
              <img src='/public/img/app-store.svg' alt='App Store' />
            </a>
            <a target='_blank' className='play-store' title='Download from Google Play' href='https://play.google.com/store/apps/details?id=com.victorops.androidclient'>
              <img src='/public/img/play-store.svg' alt='Google Play' />
            </a>
          </li>

          <li className={'primary-nav-item dropdown help-wrapper ' + helpIsOpenClass} onClick={() => this.setState({helpIsOpen: !helpIsOpen})} >
            <a href='#' className='dropdown-toggle no-caret' data-toggle='dropdown'>
                Get Help
            </a>

            <ul className='help-menu'>
              <li>
                <a href='//go.victorops.com/feedback' target='_blank'>Contact Support</a>
              </li>
              <li>
                <a href='https://victorops.statuspage.io/' target='_blank'>System Status</a>
              </li>
              <li>
                <a href='https://help.victorops.com/knowledge-base' target='_blank'>Knowledge Base</a>
              </li>
            </ul>
          </li>
        </ul>
      </footer>
    )
  }
}
