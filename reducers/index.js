import { combineReducers } from 'redux'
import auth, { initialState as authInitialState } from './auth'
import iframeModal, { initialState as iframeModalState } from './iframemodal'
import modal, { initialState as modalState } from './modal'
import meta, { initialState as metaInitialState } from './meta'
import reportingOnCall, { initialState as reportingOnCallInitialData } from './reporting-on-call'
import incidentFrequency, { initialState as incidentFrequencyInitialData } from './incident-frequency'
import mttaMttr, { initialState as mttaMttrInitialState } from './mtta-mttr'
import teams, { initialState as teamsInitialState } from './teams'

const reducers = {
  auth,
  iframeModal,
  incidentFrequency,
  meta,
  modal,
  mttaMttr,
  reportingOnCall,
  teams
}

export const initialState = {
  auth: authInitialState,
  iframeModal: iframeModalState,
  incidentFrequency: incidentFrequencyInitialData,
  meta: metaInitialState,
  modal: modalState,
  mttaMttr: mttaMttrInitialState,
  reportingOnCall: reportingOnCallInitialData,
  teams: teamsInitialState
}

export default combineReducers(reducers)
