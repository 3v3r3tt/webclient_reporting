// const endpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencysegmentincidents`
// const requestBody = {
//   team: '',
//   start_time: '1501459200000',
//   end_time: '1504742400000',
//   segment_type: 'service',
//   segment_name: 'New Relic'
//   tz_offset: -6.0
// }

const tableData = {
  segment: 'New Relic',
  incidents: [
    {
      incident: '[#12345] Something bad happened',
      'start_time': '1501459265000',
      'service': 'incingaserver1.den02.victory',
      'host': 'Im a HOST, or maybe Im a cloud. Robot existentialism sucks',
      'monitoring_tool': 'NewRelic',
      'teams': ['alpha-team']
    },
    {
      'incident': '[#12345] Things got worse',
      'start_time': '1501469200000',
      'service': 'incingaserver1.den02.victory',
      'host': 'host info goes here',
      'monitoring_tool': 'NewRelic',
      'teams': ['alpha-team', 'beta-team']
    },
    {
      'incident': '[#12345] One more for good measure',
      'start_time': '1501481301000',
      'service': 'incingaserver1.den03.victory',
      'host': 'more host info goes here',
      'monitoring_tool': 'NewRelic',
      'teams': ['alpha-team']
    },
    {
      'incident': '[#12345] Incident has been resolved',
      'start_time': '1501491301000',
      'service': 'incingaserver1.den03.victory',
      'host': 'more host info goes here',
      'monitoring_tool': 'NewRelic',
      'teams': ['alpha-team']
    }
  ]
}

export default tableData
