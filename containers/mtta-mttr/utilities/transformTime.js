import moment from 'moment'

export default function _transformTime (value, incidents) {
  const duration = moment.duration(value, 'seconds')

  const dayText = duration.days() > 0 ? `${Math.floor(duration.asDays())}d ` : ''
  const hourText = duration.hours() > 0 ? `${duration.hours()}h ` : ''
  const minuteText = duration.minutes() > 0 ? `${duration.minutes()}m ` : ''
  const secondText = duration.seconds() > 0 ? `${duration.seconds()}s ` : ''

  if (dayText) {
    return `${dayText}${hourText}${minuteText}`
  } else if (hourText || minuteText || secondText) {
    return `${hourText}${minuteText}${secondText}`
  } else {
    return 'N/A'
  }
}
