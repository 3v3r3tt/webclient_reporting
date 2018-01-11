import { Map } from 'immutable'

export const onCallReportTeamState = Map({
  selectedTeam: 'alpha-team',
  beginDate: 1503088744000,
  endDate: 1505767144000
})

export const onCallReportTeamPayload = Map({
  team: 'alpha-team',
  begin: 1503088744000,
  end: 1505800799999
})

export const onCallReportTeamData = {
  'team': {
    'slug': 'alpha-team',
    'members': [{
      'username': 'wayne',
      'full_name': 'Wayne Alberts',
      'total_hours_on_call': 72,
      'total_incidents_involved_with': 0
    }, {
      'username': 'raybert',
      'full_name': 'Bert Ray',
      'total_hours_on_call': 516,
      'total_incidents_involved_with': 0
    }]
  }
}

export const onCallReportUserState = Map({
  selectedUser: 'tsalamanca',
  selectedTeam: 'alpha-team',
  beginDate: 1503088744000,
  endDate: 1505767144000
})

export const onCallReportUserPayload = Map({
  user: 'tsalamanca',
  team: 'alpha-team',
  begin: 1503088744000,
  end: 1505800799999
})

export const onCallReportUserData = {
  'team_name': 'alpha-team',
  'user_data': {
    'user_rollup': {
      'username': 'tsalamanca',
      'full_name': 'Tuco Salamanca',
      'total_hours_on_call': '400:00',
      'total_incidents_involved_with': 2
    },
    'on_call': [
      {
        'start_epoch': 1512086400000,
        'end_epoch': 1512117000000,
        'total_hours_for_period': '8:30',
        'escalation_policy_name': 'DevOps',
        'rotation_name': 'Daytime',
        'shift_name': 'Morning',
        'override': '@ddeer'
      },
      {
        'start_epoch': 1512172800000,
        'end_epoch': 1512201600000,
        'total_hours_for_period': '8:00',
        'escalation_policy_name': 'DevOps',
        'rotation_name': 'Overnight',
        'shift_name': 'Evening',
        'override': ''
      },
      {
        'start_epoch': 1512259200000,
        'end_epoch': 1512288000000,
        'total_hours_for_period': '8:00',
        'escalation_policy_name': 'DevOps',
        'rotation_name': 'Daytime',
        'shift_name': 'Morning',
        'override': ''
      },
      {
        'start_epoch': 1512345600000,
        'end_epoch': 1512431999000,
        'total_hours_for_period': '8:00',
        'escalation_policy_name': 'If All Else Fails',
        'rotation_name': 'Daytime',
        'shift_name': '',
        'override': '@wwhite'
      }
    ],
    'incidents': [{
      'timeline_of_incident': []
    }]
  }
}
