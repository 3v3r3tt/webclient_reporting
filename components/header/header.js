// This is our new react header. First take between sprints.
// TODO create current class to work for all routes. Consider using react-router for path matching

import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'vendor/moment'

import {
  browserHistory
} from 'react-router'

import {
  getCompleteProfileStatus
} from 'reporting/selectors'

import Victory from '@victorops/victory'

const {
  Dropdown
} = Victory

const buyNow = function (value) {
  var left = moment(value).diff(moment(), 'days')
  if (left === 0) {
    return ('today')
  } else if (left === 1) {
    return ('in 1 day')
  } else {
    return ('in ' + left + ' days')
  }
}

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showBilling: false,
      completeModalIsOpen: false
    }
  }

  _isAdmin () {
    return this.props.auth.config.get('isAdmin', false)
  }

  _getAccountType () {
    return this.props.auth.config.getIn(['billing', 'state'], 'trial')
  }

  _isPaidAdmin () {
    return this._getAccountType() === 'paid' && this._isAdmin()
  }

  _isTrialAdmin () {
    return this._getAccountType() === 'trial' && this._isAdmin()
  }

  _isTrialMember () {
    return this._getAccountType() === 'trial' && !this._isAdmin()
  }

  _changeOrg (event) {
    const value = event.target.value
    const path = browserHistory.getCurrentLocation().pathname.split('/')
    path[2] = value
    browserHistory.push(path.join('/'))

    window.location.reload(false)
  }

  _getOrgs () {
    const config = this.props.auth.config
    const orgs = config.get('orgs', [])

    if (orgs.size > 1) {
      return (
        <select onChange={this._changeOrg}>
          {
            orgs.map(function (org, index) {
              const orgName = org.get('name', '')
              return (<option key={index} selected={orgName === config.get('orgname', '')} value={org.get('slug', '')}>{ orgName }</option>)
            })
          }
        </select>
      )
    } else {
      return (
        <h1>
          { config.get('orgname', '') }
        </h1>
      )
    }
  }

  _getBuyNowAdmin () {
    if (this._isTrialAdmin()) {
      const trialEnd = buyNow(this.props.auth.config.getIn(['billing', 'trial_end'], null))
      return (
        <li className='primary-nav-billing'>
          <span>
            VictorOps Enterprise trial expires { trialEnd }
            &nbsp;<a href='#/buy-now' className='buy-now'>Buy now!</a>
            &nbsp;or&nbsp;
            <a href='https://victorops.com/pricing/' className='buy-now' target='_blank'>
                learn more
            </a>
          </span>
        </li>
      )
    } else {
      return null
    }
  }

  _getBuyNowNonAdmin () {
    if (this._isTrialMember()) {
      const trialEnd = buyNow(this.props.auth.config.getIn(['billing', 'trial_end'], null))
      return (
        <li className='primary-nav-billing' >
          <span>
            VictorOps Enterprise trial expires {trialEnd}
            &nbsp;
            <a href='https://victorops.com/pricing/' className='buy-now-nonadmin' target='_blank'>
                Learn more
            </a>
          </span>
        </li>
      )
    } else {
      return null
    }
  }

  _toggleCompleteModal () {
    this.setState({
      completeModalIsOpen: !this.state.completeModalIsOpen
    })
  }

  _nagbar () {
    const completeProfile = this.props.completeProfile
    const profileComplete = completeProfile.get('hasAll', true)
    const hasPhone = completeProfile.get('hasPhone', true)
    const hasPolicy = completeProfile.get('hasPolicy', true)
    this._toggleCompleteModal = this._toggleCompleteModal.bind(this)

    if (profileComplete) {
      return null
    } else {
      const isOpen = (this.state.completeModalIsOpen) ? 'open' : null
      const modalClassNames = `primary-nav-item dropdown-wrapper dropdown ${isOpen}`
      return (
        <ul className='primary-nav user-nagbar'>
          <li className={modalClassNames} >
            <a href='#' className='dropdown-toggle no-caret' onClick={this._toggleCompleteModal} data-toggle='dropdown'>Complete your profile</a>
            <div className='dropdown-menu'>
              {(!hasPhone) ? <p>Enter a phone number and customize your paging policy to ensure we are able to reach you when an incident is routed to you.</p> : null}
              {(!hasPhone && !hasPolicy)
              ? <div >
                {(hasPhone) ? <p>Enter a phone number to ensure we are able to reach you when an incident is routed to you.</p> : null}
                {(hasPolicy) ? <p>Customize your paging policy to ensure we are able to reach you when an incident is routed to you.</p> : null}
              </div> : null}
              <a className='js-show-profile button-add' onClick={() => { this.props.modalActions.toggleModal() && this._toggleCompleteModal() }} >Complete your profile</a>
            </div>
          </li>
        </ul>
      )
    }
  }

  render () {
    const config = this.props.auth.config
    const orgslug = config.get('orgslug', '')

    const dropdownItemsVariations = [
      { label: 'Your Profile', handleClick: () => { this.props.modalActions.toggleModal() } },
      { label: 'divider', content: <div className='dropdown-divider' /> },
      { label: 'Log out', handleClick: () => { window.location = '/auth/logout' } }
    ]

    return (
      <div>
        <header id='primary--header' className='js-primary-header primary-header'>

          <div className='js-org-switcher org-name-wrapper'>
            { this._getOrgs() }
          </div>

          <ul className='js-global-nav primary-nav'>
            <li className='primary-nav-item'>
              <a href={'/client/' + orgslug}>Timeline</a>
            </li>

            <li className='primary-nav-item'>
              <a href={'/dash/' + orgslug}>Settings</a>
            </li>

            <li className='primary-nav-item'>
              <a data-nav='reports' href={'/reports/' + orgslug} className='current'>Reports</a>
            </li>

            { this._getBuyNowAdmin() }
            { this._getBuyNowNonAdmin() }

          </ul>
          <div className='user-nav dropdown-wrapper dropdown'>
            <Dropdown
              dropdownItems={dropdownItemsVariations}
              label={`@${config.getIn(['auth', 'user', 'username'], '')}`}
              triggerClasses={['btn', 'dropdown-toggle', 'dropdown-btn']}
              customClasses={['user-nav dropdown-wrapper dropdown', 'dropdown-div']}
            />
          </div>
          { this._nagbar() }
        </header>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    completeProfile: getCompleteProfileStatus(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
