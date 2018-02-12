import React from 'react'

import ReportingDeprecated from './reports-deprecated'
import ReportingNew from './reports-new'

class Reports extends React.Component {
  render () {
    const fetchingFeatureFlags = this.props.featureFlags.get('isFetching', true)
    const mmr = this.props.featureFlags.getIn(['featureFlags', 'feature:mttv2'], false)
    return (
      (!fetchingFeatureFlags && mmr)
      ? <ReportingNew {...this.props} />
      : <ReportingDeprecated {...this.props} />
    )
  }
}

export default Reports
