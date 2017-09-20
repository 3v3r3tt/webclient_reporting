import { combineReducers } from 'redux'
import auth, { initialState as authInitialState } from './auth'
import iframeModal, { initialState as iframeModalState } from './iframemodal'
import meta, { initialState as metaInitialState } from './meta'
import reportingOnCall, { initialState as reportingOnCallInitialData } from './reporting-on-call'
import teams, { initialState as teamsInitialState } from './teams'

const reducers = {
  auth,
  iframeModal,
  meta,
  reportingOnCall,
  teams
}

export const initialState = {
  auth: authInitialState,
  iframeModal: iframeModalState,
  meta: metaInitialState,
  reportingOnCall: reportingOnCallInitialData,
  teams: teamsInitialState
}

export default combineReducers(reducers)
