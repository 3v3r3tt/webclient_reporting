// Post Mortem Reports
export const POST_MORTEM_ACTION_ITEMS_CREATE = 'POST_MORTEM_ACTION_ITEMS_CREATE'
export const POST_MORTEM_ACTION_ITEMS_GET = 'POST_MORTEM_ACTION_ITEMS_GET'
export const POST_MORTEM_ACTION_ITEMS_REMOVE = 'POST_MORTEM_ACTION_ITEMS_REMOVE'
export const POST_MORTEM_ACTION_ITEMS_UPDATE = 'POST_MORTEM_ACTION_ITEMS_UPDATE'
export const POST_MORTEM_DATE_UPDATE = 'POST_MORTEM_DATE_UPDATE'
export const POST_MORTEM_FIELD_UPDATE = 'POST_MORTEM_FIELD_UPDATE'
export const POST_MORTEM_GET = 'POST_MORTEM_GET'
export const POST_MORTEM_RESET = 'POST_MORTEM_RESET'
export const POST_MORTEM_REPORT_UPDATE = 'POST_MORTEM_REPORT_UPDATE'
export const POST_MORTEM_SAVE_FORM = 'POST_MORTEM_SAVE_FORM'
export const POST_MORTEM_TIMELINE_GET = 'POST_MORTEM_TIMELINE_GET'
export const POST_MORTEM_TIMELINE_NOTES_GET = 'POST_MORTEM_TIMELINE_NOTES_GET'
export const POST_MORTEM_TIMELINE_NOTES_UPDATE = 'POST_MORTEM_TIMELINE_NOTES_UPDATE'
export const POST_MORTEM_UPDATE = 'POST_MORTEM_UPDATE'
export const POST_MORTEM_TIMELINE_UPDATE = 'POST_MORTEM_TIMELINE_UPDATE'

// Post Mortems
// ---------------------------------------------------------------------------

export function resetPostMortem () {
  return {
    type: POST_MORTEM_RESET
  }
}

export function getPostMortem (payload) {
  return {
    type: POST_MORTEM_GET,
    payload
  }
}

export function savePostMortem (payload) {
  return {
    type: POST_MORTEM_SAVE_FORM,
    payload
  }
}

export function updateTimeline (payload) {
  return {
    type: POST_MORTEM_TIMELINE_UPDATE,
    payload
  }
}

export function updatePostMortem (payload) {
  return {
    type: POST_MORTEM_UPDATE,
    payload
  }
}

export function updateReportField (payload) {
  return {
    type: POST_MORTEM_FIELD_UPDATE,
    payload
  }
}

export function updatePostMortemDateRange (payload) {
  return {
    type: POST_MORTEM_DATE_UPDATE,
    payload
  }
}

export function updatePostMortemReport (payload) {
  return {
    type: POST_MORTEM_REPORT_UPDATE,
    payload
  }
}

export function getPostMortemActionItems (payload) {
  return {
    type: POST_MORTEM_ACTION_ITEMS_GET,
    payload
  }
}

export function createPostMortemActionItem (payload) {
  return {
    type: POST_MORTEM_ACTION_ITEMS_CREATE,
    payload
  }
}

export function updatePostMortemActionItems (payload) {
  return {
    type: POST_MORTEM_ACTION_ITEMS_UPDATE,
    payload
  }
}

export function removePostMortemActionItem (payload) {
  return {
    type: POST_MORTEM_ACTION_ITEMS_REMOVE,
    payload
  }
}

export function getTimeline (payload) {
  return {
    type: POST_MORTEM_TIMELINE_GET,
    payload
  }
}

export function getPostMortemTimelineNotes (payload) {
  return {
    type: POST_MORTEM_TIMELINE_NOTES_GET,
    payload
  }
}

export function updatePostMortemTimelineNotes (payload = {}) {
  return {
    type: POST_MORTEM_TIMELINE_NOTES_UPDATE,
    payload
  }
}
