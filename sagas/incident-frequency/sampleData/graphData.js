// const endpoint = `/api/v1/org/${config.auth.org.slug}/reports/incidentfrequencygraph`
// const requestBody = {
//   team: '',
//   start_time: '1501459200000',
//   end_time: '1504742400000',
//   display_by: 'week',
//   segment_type: 'service',
//   tz_offset: -6.0
// }

const graphData = {
  'has_data_flag': false,
  'display_buckets': [
    {
      bucket_start_date: '1501459200000',
      segments_and_values: [
        {
          segment_name: 'Nagios',
          bucket_total: 10
        },
        {
          segment_name: 'New Relic',
          bucket_total: 3
        },
        {
          segment_name: 'Webhook',
          bucket_total: 5
        },
        {
          segment_name: 'Zendesk',
          bucket_total: 1
        },
        {
          segment_name: 'Datadog',
          bucket_total: 3
        },
        {
          segment_name: 'Email',
          bucket_total: 9
        }
      ]
    },
    {
      bucket_start_date: '1502064000000',
      segments_and_values: [
        {
          segment_name: 'Nagios',
          bucket_total: 3
        },
        {
          segment_name: 'New Relic',
          bucket_total: 2
        },
        {
          segment_name: 'Webhook',
          bucket_total: 5
        },
        {
          segment_name: 'Zendesk',
          bucket_total: 6
        },
        {
          segment_name: 'Datadog',
          bucket_total: 10
        },
        {
          segment_name: 'Email',
          bucket_total: 1
        }
      ]
    },
    {
      bucket_start_date: '1502668800000',
      segments_and_values: [
        {
          segment_name: 'Nagios',
          bucket_total: 6
        },
        {
          segment_name: 'New Relic',
          bucket_total: 8
        },
        {
          segment_name: 'Webhook',
          bucket_total: 2
        },
        {
          segment_name: 'Zendesk',
          bucket_total: 3
        },
        {
          segment_name: 'Datadog',
          bucket_total: 2
        },
        {
          segment_name: 'Email',
          bucket_total: 6
        }
      ]
    },
    {
      bucket_start_date: '1503273600000',
      segments_and_values: [
        {
          segment_name: 'Nagios',
          bucket_total: 12
        },
        {
          segment_name: 'New Relic',
          bucket_total: 4
        },
        {
          segment_name: 'Webhook',
          bucket_total: 0
        },
        {
          segment_name: 'Zendesk',
          bucket_total: 9
        },
        {
          segment_name: 'Datadog',
          bucket_total: 6
        },
        {
          segment_name: 'Email',
          bucket_total: 2
        }
      ]
    },
    {
      bucket_start_date: '1503878400000',
      segments_and_values: [
        {
          segment_name: 'Nagios',
          bucket_total: 8
        },
        {
          segment_name: 'New Relic',
          bucket_total: 0
        },
        {
          segment_name: 'Webhook',
          bucket_total: 2
        },
        {
          segment_name: 'Zendesk',
          bucket_total: 6
        },
        {
          segment_name: 'Datadog',
          bucket_total: 11
        },
        {
          segment_name: 'Email',
          bucket_total: 3
        }
      ]
    },
    {
      bucket_start_date: '1504483200000',
      segments_and_values: [
        {
          segment_name: 'Nagios',
          bucket_total: 6
        },
        {
          segment_name: 'New Relic',
          bucket_total: 3
        },
        {
          segment_name: 'Webhook',
          bucket_total: 4
        },
        {
          segment_name: 'Zendesk',
          bucket_total: 11
        },
        {
          segment_name: 'Datadog',
          bucket_total: 1
        },
        {
          segment_name: 'Email',
          bucket_total: 4
        }
      ]
    }
  ],
  segments: [
    {
      segment_name: 'Nagios',
      bucket_total: 45
    },
    {
      segment_name: 'New Relic',
      bucket_total: 20
    },
    {
      segment_name: 'Webhook',
      bucket_total: 18
    },
    {
      segment_name: 'Zendesk',
      bucket_total: 36
    },
    {
      segment_name: 'Datadog',
      bucket_total: 20
    },
    {
      segment_name: 'Email',
      bucket_total: 4
    }
  ]
}

export default graphData
