import { combineReducers } from 'redux'
import auth, { initialState as authInitialState } from './auth'
import iframeModal, { initialState as iframeModalState } from './iframemodal'
import modal, { initialState as modalState } from './modal'
import meta, { initialState as metaInitialState } from './meta'
import reportingOnCall, { initialState as reportingOnCallInitialData } from './reporting-on-call'
import incidentFrequency, { initialState as incidentFrequencyInitialData } from './incident-frequency'
import teams, { initialState as teamsInitialState } from './teams'

const reducers = {
  auth,
  iframeModal,
  modal,
  meta,
  reportingOnCall,
  incidentFrequency,
  teams
}

export const initialState = {
  auth: authInitialState,
  iframeModal: iframeModalState,
  modal: modalState,
  meta: metaInitialState,
  reportingOnCall: reportingOnCallInitialData,
  incidentFrequency: incidentFrequencyInitialData,
  teams: teamsInitialState
}

export default combineReducers(reducers)
