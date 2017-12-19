import React from 'react'

import { Link } from 'react-router'

class Reports extends React.Component {
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
    const onCallFeatureFlagIsTrue = this.props.featureFlags.getIn(['featureFlags', 'feature:oncallreport'], false)
    const orgslug = this.props.params.org

    switch (onCallFeatureFlagIsTrue) {
      case true:
        return (
          <Link to={`/reports/${orgslug}/on-call`} className='on-call reports-nav-item'>
            <div className='card-header'>
              <h6 className='card-header__heading'>On-Call</h6>
            </div>
            <div className='preview' />
          </Link>
        )
      default:
        return (
          <a href={`/dash/${orgslug}/#/reports/view/User`} className='User reports-nav-item'>
            <div className='card-header'>
              <h6 className='card-header__heading'>User Metrics</h6>
            </div>
            <div className='preview' />
          </a>
        )
    }
  }

  _getIncidentFrequencyTile () {
    const incidentFrequencyFlagIsTrue = this.props.featureFlags.getIn(['featureFlags', 'feature:incidentfrequencyreport'], false)
    const orgslug = this.props.params.org

    switch (incidentFrequencyFlagIsTrue) {
      case true:
        return (
          <Link to={`/reports/${orgslug}/incident-frequency`} className='Strategic reports-nav-item incident-frequency'>
            <div className='card-header'>
              <h6 className='card-header__heading'>Incident Frequency</h6>
            </div>
            <div className='preview' />
          </Link>
        )
      default:
        return (
          <a href={`/dash/${orgslug}/#/reports/view/Strategic`} className='Strategic reports-nav-item'>
            <div className='card-header'>
              <h6 className='card-header__heading'>Incident Frequency</h6>
            </div>
            <div className='preview' />
          </a>
        )
    }
  }

  render () {
    const orgslug = this.props.params.org
    const featchingFeatureFlags = this.props.featureFlags.get('isFetching', true)
    return (
      <div id='newadmin'>
        <div className='module-wrapper'>
          <div className='js-region-reports-nav view-section' style={{'paddingTop': '20px'}}>
            <div className='ui-mask' />
            <h4>Reporting</h4>
            <ul className='reports-nav'>
              <a className='reports-nav-item post-mortems' href={this._createLink('#/reports/post-mortems')}>
                <div className='card-header'>
                  <h6 className='card-header__heading'>Post-Incident Reviews</h6>
                </div>
                <div className='preview' />
              </a>
              <a href={this._createLink('#/reports/view/Incident_Metrics')} className='basic-a reports-nav-item'>
                <div className='card-header'>
                  <h6 className='card-header__heading'>Incident Metrics</h6>
                </div>
                <div className='preview' />
              </a>
              { (!featchingFeatureFlags && this.props.featureFlags.getIn(['featureFlags', 'feature:mttv2'], false))
                ? <Link href={this._createLink('#/reports/view/MTTA_MTTR')} className='basic-b reports-nav-item'>
                  <div className='card-header'>
                    <h6 className='card-header__heading'>Organization MTTA/MTTR</h6>
                  </div>
                  <div className='preview' />
                </Link>

                : <Link to={`/reports/${orgslug}/mtta-mttr`} className='basic-b reports-nav-item mtta-mttr reports-nav-item'>
                  <div className='card-header'>
                    <h6 className='card-header__heading'>Organization MTTA/MTTR</h6>
                  </div>
                  <div className='preview' />
                </Link>
                }

              <Link href={this._createLink('#/reports/view/Trends')} data-report='Trends' className='basic-c reports-nav-item'>
                <div className='card-header'>
                  <h6 className='card-header__heading'>Incident Trends</h6>
                </div>
                <div className='preview' />
              </Link>

            </ul>
          </div>
          <div className='js-advancedrep'>
            <h4>Advanced Reporting</h4>
            { (!featchingFeatureFlags)
              ? <ul className='reports-nav'>
                { this._getIncidentFrequencyTile() }
                { this._getOnCallTile() }
              </ul>
              : null
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Reports
