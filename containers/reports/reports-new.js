import React from 'react'

import { Link } from 'react-router'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faLockAlt } from '@fortawesome/fontawesome-pro-regular'

class ReportsNew extends React.Component {
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
    const fetchingFeatureFlags = this.props.featureFlags.get('isFetching', true)
    const orgslug = this.props.params.org

    const onCallTile =
      <Link to={`/reports/${orgslug}/on-call`} className='reports-container-link'>
        <div className='report-header'>
          <h3 className='report-header--heading'>On-Call</h3>
          <span className='report-header--subheading'>Understand individual on-call and incident workload</span>
        </div>
        <div className='image--container'><img src='/img/ocr-thumbnail.png' className='image' /></div>
      </Link>

    if (!fetchingFeatureFlags && advancedReporting) {
      return onCallTile
    } else {
      return (
        <div className='tile--is-locked'>
          <FontAwesomeIcon icon={faLockAlt} className='reporting--lock' />
          {onCallTile}
        </div>
      )
    }
  }

  _getPIRTile () {
    const orgslug = this.props.params.org
    const reacttimelinepirFF = this.props.featureFlags.getIn(['featureFlags', 'feature:reacttimelinepir'], false)

    if (reacttimelinepirFF) {
      return (
        <Link className='reports-container-link' to={`/reports/${orgslug}/post-mortems`}>
          <div className='report-header'>
            <h3 className='report-header--heading'>Post-Incident Reviews</h3>
            <span className='report-header--subheading'>Analyze incidents and mark action steps to continuously improve</span>
          </div>
          <div className='image--container'><img src='/img/pir-thumbnail.png' className='image' /></div>
        </Link>
      )
    } else {
      return (
        <a className='reports-container-link' disabled href={this._createLink('#/reports/post-mortems')}>
          <div className='report-header'>
            <h3 className='report-header--heading'>Post-Incident Reviews</h3>
            <span className='report-header--subheading'>Analyze incidents and mark action steps to continuously improve</span>
          </div>
          <div className='image--container'><img src='/img/pir-thumbnail.png' className='image' /></div>
        </a>
      )
    }
  }

  _getIncidentFrequencyTile () {
    const fetchingFeatureFlags = this.props.featureFlags.get('isFetching', true)
    const advancedReporting = this.props.featureFlags.getIn(['featureFlags', 'feature:advancedrep'], false)
    const orgslug = this.props.params.org

    const incidentFrequencyTile =
      <Link to={`/reports/${orgslug}/incident-frequency`} className='reports-container-link'>
        <div className='report-header'>
          <h3 className='report-header--heading'>Incident Frequency</h3>
          <span className='report-header--subheading'>Pinpoint the frequent incident causing parts of your ecosystem</span>
        </div>
        <div className='image--container'><img src='/img/ifr-thumbnail.png' className='image' /></div>
      </Link>

    if (!fetchingFeatureFlags && advancedReporting) {
      return (incidentFrequencyTile)
    } else {
      return (
        <div className='tile--is-locked'>
          <FontAwesomeIcon icon={faLockAlt} className='reporting--lock' />
          {incidentFrequencyTile}
        </div>
      )
    }
  }

  _getMMR () {
    const orgslug = this.props.params.org
    return (
      <Link to={`/reports/${orgslug}/mtta-mttr`} className='reports-container-link reports-container-link'>
        <div className='report-header'>
          <h3 className='report-header--heading'>Organization MTTA/MTTR</h3>
          <span className='report-header--subheading'>Evaluate your organizational and team incident metrics</span>
        </div>
        <div className='image--container'><img src='/img/mmr-thumbnail.png' className='image' /></div>
      </Link>
    )
  }

  _getSubtitle () {
    const advancedReporting = this.props.featureFlags.getIn(['featureFlags', 'feature:advancedrep'], false)
    const text =
      <h2 className='reporting--subtitle'>
        <FontAwesomeIcon icon={faLockAlt} className='reporting--subtitle--lock' />
        Unlock Enterprise Reporting by contacting <a href='mailto:success@victorops.com'>success@victorops.com</a>
      </h2>
    const displayedText = advancedReporting ? null : text
    return displayedText
  }

  render () {
    const fetchingFeatureFlags = this.props.featureFlags.get('isFetching', true)
    const advancedReporting = this.props.featureFlags.getIn(['featureFlags', 'feature:advancedrep'], false)
    const title = (!fetchingFeatureFlags && advancedReporting) ? 'Enterprise reporting' : 'Basic reporting'
    return (
      <div id='newadmin'>
        <div className='module-wrapper'>
          <div className='js-region-reports-container view-section react-reports' style={{'paddingTop': '20px'}}>
            <div className='ui-mask' />
            <h1 className='reporting--title'>{title}</h1>
            { this._getSubtitle() }
            <ul className='reports-container'>
              { this._getPIRTile() }
              { this._getMMR() }
              { this._getOnCallTile() }
              { this._getIncidentFrequencyTile() }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default ReportsNew
