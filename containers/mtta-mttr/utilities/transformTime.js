import moment from 'moment'

export default function _transformTime (value, incidents) {
  const duration = moment.duration(value, 'seconds')

  const dayText = duration.days() > 0 ? `${duration.days()}d ` : ''
  const hourText = duration.hours() > 0 ? `${duration.hours()}h ` : ''
  const minuteText = duration.minutes() > 0 ? `${duration.minutes()}m` : ''
  const goalText = `${dayText}${hourText}${minuteText}`

  if (incidents > 0 && value < 60) {
    return `${Math.floor(duration.asSeconds())}s`
  }
  return goalText.length ? goalText : 'N/A'
}
