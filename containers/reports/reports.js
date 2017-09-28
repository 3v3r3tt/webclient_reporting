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

  render () {
    const orgslug = this.props.params.org
    const onCallFeatureFlagIsTrue = this.props.featureFlags.getIn(['featureFlags', 'feature:reportingv2'], false)
    const incidentFrequencyFlagIsTrue = this.props.featureFlags.getIn(['featureFlags', 'feature:incidentfrequencyreporting'], false)

    return (
      <div id='newadmin'>
        <div className='module-wrapper'>
          <div className='js-region-reports-nav view-section' style={{'paddingTop': '20px'}}>
            <div className='ui-mask' />
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
          </div>
          <div className='js-advancedrep'>
            <ul className='reports-nav'>
              <h4>Advanced Reporting</h4>
              {(incidentFrequencyFlagIsTrue)
                ? <Link to={`/reports/${orgslug}/incident-frequency`} className='Strategic reports-nav-item'>
                  <div className='card-header'>
                    <h6 className='card-header__heading'>Incident Frequency</h6>
                  </div>
                  <div className='preview' />
                </Link>
                : <a href='/dash/tron/#/reports/view/Strategic' className='Strategic reports-nav-item'>
                  <div className='card-header'>
                    <h6 className='card-header__heading'>Incident Frequency</h6>
                  </div>
                  <div className='preview' />
                </a>
                }

              { (onCallFeatureFlagIsTrue)
               ? <Link to={`/reports/${orgslug}/on-call`} className='on-call reports-nav-item'>
                 <div className='card-header'>
                   <h6 className='card-header__heading'>On Call</h6>
                 </div>
                 <div className='preview' />
               </Link>
              : <a href='/dash/tron/#/reports/view/User' className='User reports-nav-item'>
                <div className='card-header'>
                  <h6 className='card-header__heading'>User Metrics</h6>
                </div>
                <div className='preview' />
              </a>
              }

            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Reports
