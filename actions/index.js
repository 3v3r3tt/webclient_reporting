import { bindActionCreators } from 'redux'
import * as iframeModalActions from './iframemodal'
import * as MetaActions from './meta'
import * as reportingActions from './reporting'
import * as teamsActions from './teams'

export function bindActions (dispatch) {
  return {
    iframemodal: bindActionCreators(iframeModalActions, dispatch),
    meta: bindActionCreators(MetaActions, dispatch),
    reportingActions: bindActionCreators(reportingActions, dispatch),
    teamsActions: bindActionCreators(teamsActions, dispatch)
  }
}
