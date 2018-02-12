import React from 'react'

import { Link } from 'react-router'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faLockAlt } from '@fortawesome/fontawesome-pro-solid'

class ReportsDeprecated extends React.Component {
  constructor () {
    super()
    this._createLink = this._createLink.bind(this)
  }

  _createLink (urlSuffix, prefix = '/dash') {
    const orgslug = this.props.params.org
    const href = `${prefix}/${orgslug}${urlSuffix}`
    return href
  }

  _getOnCallTile () {
    const advancedReporting = this.props.featureFlags.getIn(['featureFlags', 'feature:advancedrep'], false)
    const featchingFeatureFlags = this.props.featureFlags.get('isFetching', true)
    const orgslug = this.props.params.org
    if (!featchingFeatureFlags && advancedReporting) {
      return (
        <Link to={`/reports/${orgslug}/on-call`} className='on-call reports-nav-item'>
          <div className='card-header'>
            <h6 className='card-header__heading'>On-Call</h6>
          </div>
          <div className='preview' />
        </Link>
      )
    } else {
      return (
        <div className='tile--is-locked'>
          <FontAwesomeIcon icon={faLockAlt} className='reporting--lock' />
          <Link to={`/reports/${orgslug}/on-call`} className='on-call reports-nav-item'>
            <div className='card-header'>
              <h6 className='card-header__heading'>On-Call</h6>
            </div>
            <div className='preview' />
          </Link>
        </div>
      )
    }
  }

  _getPIRTile () {
    const orgslug = this.props.params.org
    const reacttimelinepirFF = this.props.featureFlags.getIn(['featureFlags', 'feature:reacttimelinepir'], false)

    if (reacttimelinepirFF) {
      return (
        <Link className='reports-nav-item post-mortems' to={`/reports/${orgslug}/post-mortems`}>
          <div className='card-header'>
            <h6 className='card-header__heading'>Post-Incident Reviews</h6>
          </div>
          <div className='preview' />
        </Link>
      )
    } else {
      return (
        <a className='reports-nav-item post-mortems ' disabled href={this._createLink('#/reports/post-mortems')}>
          <div className='card-header'>
            <h6 className='card-header__heading'>Post-Incident Reviews</h6>
          </div>
          <div className='preview' />
        </a>
      )
    }
  }

  _getIncidentFrequencyTile () {
    const advancedReporting = this.props.featureFlags.getIn(['featureFlags', 'feature:advancedrep'], false)
    const featchingFeatureFlags = this.props.featureFlags.get('isFetching', true)

    const orgslug = this.props.params.org
    if (!featchingFeatureFlags && advancedReporting) {
      return (
        <Link to={`/reports/${orgslug}/incident-frequency`} className='Strategic reports-nav-item incident-frequency'>
          <div className='card-header'>
            <h6 className='card-header__heading'>Incident Frequency</h6>
          </div>
          <div className='preview' />
        </Link>
      )
    } else {
      return (
        <div className='tile--is-locked'>
          <FontAwesomeIcon icon={faLockAlt} className='reporting--lock' />
          <Link to={`/reports/${orgslug}/incident-frequency`} className='Strategic reports-nav-item incident-frequency'>
            <div className='card-header'>
              <h6 className='card-header__heading'>Incident Frequency</h6>
            </div>
            <div className='preview' />
          </Link>
        </div>
      )
    }
  }

  _getMMR () {
    return (
      <ul className='reports-nav'>
        { this._getPIRTile() }
        <a href={this._createLink('#/reports/view/Incident_Metrics')} className='basic-a reports-nav-item'>
          <div className='card-header'>
            <h6 className='card-header__heading'>Incident Metrics</h6>
          </div>
          <div className='preview' />
        </a>

        <Link href={this._createLink('#/reports/view/MTTA_MTTR')} className='basic-b reports-nav-item'>
          <div className='card-header'>
            <h6 className='card-header__heading'>Organization MTTA/MTTR</h6>
          </div>
          <div className='preview' />
        </Link>

        <Link href={this._createLink('#/reports/view/Trends')} data-report='Trends' className='basic-c reports-nav-item'>
          <div className='card-header'>
            <h6 className='card-header__heading'>Incident Trends</h6>
          </div>
          <div className='preview' />
        </Link>
      </ul>
    )
  }

  render () {
    const featchingFeatureFlags = this.props.featureFlags.get('isFetching', true)
    return (
      <div id='newadmin'>
        <div className='module-wrapper'>
          <div className='js-region-reports-nav view-section' style={{'paddingTop': '20px'}}>
            <div className='ui-mask' />
            <h4>Reporting</h4>
            { this._getMMR() }
          </div>
          { (featchingFeatureFlags)
            ? null
            : <div className='js-advancedrep'>
              <h4>Advanced Reporting</h4>
              <ul className='reports-nav'>
                { this._getIncidentFrequencyTile() }
                { this._getOnCallTile() }
              </ul>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default ReportsDeprecated
