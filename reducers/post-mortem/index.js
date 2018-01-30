import {
  fromJS as _fromJS
} from 'immutable'

import {
  POST_MORTEM_ACTION_ITEMS_UPDATE,
  POST_MORTEM_DATE_UPDATE,
  POST_MORTEM_FIELD_UPDATE,
  POST_MORTEM_REPORT_UPDATE,
  POST_MORTEM_SAVE_FORM,
  POST_MORTEM_TIMELINE_NOTES_UPDATE,
  POST_MORTEM_TIMELINE_UPDATE,
  POST_MORTEM_RESET,
  POST_MORTEM_UPDATE
} from 'reporting/actions/post-mortem'

import _ from 'lodash'

export const initialState = _fromJS({
  filter: {},
  form: {},
  actionItems: [],
  timelineNotes: [],
  timeline: [],
  report: {
    annotations: [],
    begin: null,
    can_delete: true,
    can_edit: true,
    end: null,
    exclude: [],
    is_customer_impacted: false,
    timeline: null,
    source: null,
    title: '',
    token: null
  }
})

export default function postMortem (state = initialState, action) {
  switch (action.type) {
    case POST_MORTEM_ACTION_ITEMS_UPDATE :
      return state.setIn(['actionItems'], _fromJS(_.sortBy(action.payload, 'id')))
    case POST_MORTEM_TIMELINE_NOTES_UPDATE :
      return state.setIn(['timelineNotes'], _fromJS(_.sortBy(action.payload, 'timeStamp')))
    case POST_MORTEM_TIMELINE_UPDATE :
      return state.setIn(['timeline'], _fromJS(action.payload))
    case POST_MORTEM_FIELD_UPDATE :
    case POST_MORTEM_DATE_UPDATE :
      const key = Object.keys(action.payload)[0]
      return state.setIn(['report', key], action.payload[key])
    case POST_MORTEM_RESET :
      return state.setIn(['report'], _fromJS({}))
    case POST_MORTEM_UPDATE :
    case POST_MORTEM_SAVE_FORM :
    case POST_MORTEM_REPORT_UPDATE :
      if (action.payload) {
        return state.setIn(['report'], _fromJS(action.payload))
      } else {
        return state
      }

    default : return state
  }
}
