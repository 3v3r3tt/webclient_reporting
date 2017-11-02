// TODO: this endpoint is not yet built...
// const endpoint = `/api/v2/org/${config.auth.org.slug}/incidents?incidentNumber=21248
// Swagger docs to public API endpoint:
// https://portal.victorops.com/public/api-docs.html#!/Reporting/get_api_reporting_v2_incidents

const incidentModalData = {
  'offset': 0,
  'limit': 20,
  'total': 1,
  'incidents': [
    {
      'alertCount': 2,
      'currentPhase': 'resolved',
      'entityDisplayName': 'VictorOps - SalesOps Test Account (Zuora)(3): Org to Make Paid',
      'entityId': '00020392',
      'entityType': 'service',
      'host': 'server.somecluster.host.com',
      'incidentNumber': '21248',
      'lastAlertId': 'cbd5a8fc-e4e4-438d-b0e1-2a4fd5c0d00d',
      'lastAlertTime': '2017-11-01T19:15:15Z',
      'routingKey': 'support',
      'service': '00020392',
      'startTime': '2017-11-01T19:01:42Z',
      'pagedTeams': [
        'operations-support'
      ],
      'pagedUsers': [],
      'transitions': [
        {
          'name': 'triggered',
          'at': '2017-11-01T19:01:42Z',
          'alertId': '5175e3a8-c285-41c0-a737-e900077ab43f',
          'alertUrl': 'https://api.victorops.com/api-public/v1/alerts/5175e3a8-c285-41c0-a737-e900077ab43f'
        },
        {
          'name': 'resolved',
          'at': '2017-11-01T19:15:15Z',
          'alertId': 'cbd5a8fc-e4e4-438d-b0e1-2a4fd5c0d00d',
          'alertUrl': 'https://api.victorops.com/api-public/v1/alerts/cbd5a8fc-e4e4-438d-b0e1-2a4fd5c0d00d'
        }
      ]
    }
  ]
}

export default incidentModalData
