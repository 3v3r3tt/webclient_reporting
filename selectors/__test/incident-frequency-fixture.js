import {
  fromJS
} from 'immutable'

export const displayMonthlyState = {
  incidentFrequency: fromJS({
    beginDate: 1506837600000,
    endDate: 1513634666902,
    resolutionType: {
      type: 'month'
    },
    graphData: {
      'has_data_flag': true,
      'display_buckets': [
        {
          'bucket_start': 1509494400000,
          'segments_and_values': [
            {
              'segment_name': 'Nagios/Icinga',
              'bucket_total': 25
            },
            {
              'segment_name': 'Cloudwatch',
              'bucket_total': 12
            },
            {
              'segment_name': 'Manual',
              'bucket_total': 2
            }
          ]
        },
        {
          'bucket_start': 1512086400000,
          'segments_and_values': [
            {
              'segment_name': 'Nagios/Icinga',
              'bucket_total': 15
            },
            {
              'segment_name': 'Cloudwatch',
              'bucket_total': 7
            },
            {
              'segment_name': 'Manual',
              'bucket_total': 2
            }
          ]
        }
      ],
      'segments': [
        {
          'segment_name': 'Nagios/Icinga',
          'total_incidents': 40
        },
        {
          'segment_name': 'Cloudwatch',
          'total_incidents': 19
        },
        {
          'segment_name': 'Manual',
          'total_incidents': 4
        }
      ]
    }
  })
}

export const displayMonthlyFilledResponse = {
  'has_data_flag': true,
  'display_buckets': [
    {
      'bucket_start': 1506816000000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 0
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 0
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 0
        }
      ]
    },
    {
      'bucket_start': 1509494400000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 25
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 12
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 2
        }
      ]
    },
    {
      'bucket_start': 1509494400000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 0
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 0
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 0
        }
      ]
    },
    {
      'bucket_start': 1512086400000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 15
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 7
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 2
        }
      ]
    }
  ],
  'segments': [
    {
      'segment_name': 'Nagios/Icinga',
      'total_incidents': 40
    },
    {
      'segment_name': 'Cloudwatch',
      'total_incidents': 19
    },
    {
      'segment_name': 'Manual',
      'total_incidents': 4
    }
  ]
}

export const displayWeeklyState = {
  incidentFrequency: fromJS({
    beginDate: 1511042146442,
    endDate: 1513634146442,
    resolutionType: {
      type: 'week'
    },
    graphData: {
      'has_data_flag': true,
      'display_buckets': [
        {
          'bucket_start': 1511136000000,
          'segments_and_values': [
            {
              'segment_name': 'Nagios/Icinga',
              'bucket_total': 10
            },
            {
              'segment_name': 'Cloudwatch',
              'bucket_total': 5
            },
            {
              'segment_name': 'Manual',
              'bucket_total': 2}
          ]
        },
        {
          'bucket_start': 1511740800000,
          'segments_and_values': [
            {
              'segment_name': 'Nagios/Icinga',
              'bucket_total': 25
            },
            {
              'segment_name': 'Cloudwatch',
              'bucket_total': 12
            },
            {
              'segment_name': 'Manual',
              'bucket_total': 1
            }
          ]
        },
        {
          'bucket_start': 1512345600000,
          'segments_and_values': [
            {
              'segment_name': 'Nagios/Icinga',
              'bucket_total': 5
            },
            {
              'segment_name': 'Cloudwatch',
              'bucket_total': 2
            },
            {
              'segment_name': 'Manual',
              'bucket_total': 1
            }
          ]
        }
      ],
      'segments': [
        {
          'segment_name': 'Nagios/Icinga',
          'total_incidents': 40
        },
        {
          'segment_name': 'Cloudwatch',
          'total_incidents': 19
        },
        {
          'segment_name': 'Manual',
          'total_incidents': 4
        }
      ]
    }
  })
}

export const displayWeeklyFilledResponse = {
  'has_data_flag': true,
  'display_buckets': [
    {
      'bucket_start': 1510531200000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 0
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 0
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 0
        }
      ]
    },
    {
      'bucket_start': 1511136000000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 10
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 5
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 2
        }
      ]
    },
    {
      'bucket_start': 1511740800000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 25
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 12
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 1
        }
      ]
    },
    {
      'bucket_start': 1512345600000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 5
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 2
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 1
        }
      ]
    },
    {
      'bucket_start': 1512950400000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 0
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 0
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 0
        }
      ]
    },
    {
      'bucket_start': 1513555200000,
      'segments_and_values': [
        {
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 0
        },
        {
          'segment_name': 'Cloudwatch',
          'bucket_total': 0
        },
        {
          'segment_name': 'Manual',
          'bucket_total': 0
        }
      ]
    }
  ],
  'segments': [
    {
      'segment_name': 'Nagios/Icinga',
      'total_incidents': 40
    },
    {
      'segment_name': 'Cloudwatch',
      'total_incidents': 19
    },
    {
      'segment_name': 'Manual',
      'total_incidents': 4
    }
  ]
}

export const displayDailyState = {
  incidentFrequency: fromJS({
    beginDate: 1511049600000,
    endDate: 1513626133034,
    resolutionType: {
      type: 'day'
    },
    graphData: {
      'has_data_flag': true,
      'display_buckets': [{
        'bucket_start': 1511222400000,
        'segments_and_values': [{
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 10
        }, {
          'segment_name': 'Cloudwatch',
          'bucket_total': 5
        }, {
          'segment_name': 'Manual',
          'bucket_total': 0
        }]
      }, {
        'bucket_start': 1511308800000,
        'segments_and_values': [{
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 0
        }, {
          'segment_name': 'Cloudwatch',
          'bucket_total': 0
        }, {
          'segment_name': 'Manual',
          'bucket_total': 2
        }]
      }, {
        'bucket_start': 1511740800000,
        'segments_and_values': [{
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 6
        }, {
          'segment_name': 'Cloudwatch',
          'bucket_total': 3
        }, {
          'segment_name': 'Manual',
          'bucket_total': 0
        }]
      }, {
        'bucket_start': 1511827200000,
        'segments_and_values': [{
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 9
        }, {
          'segment_name': 'Cloudwatch',
          'bucket_total': 4
        }, {
          'segment_name': 'Manual',
          'bucket_total': 0
        }]
      }, {
        'bucket_start': 1512086400000,
        'segments_and_values': [{
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 10
        }, {
          'segment_name': 'Cloudwatch',
          'bucket_total': 5
        }, {
          'segment_name': 'Manual',
          'bucket_total': 1
        }]
      }, {
        'bucket_start': 1512345600000,
        'segments_and_values': [{
          'segment_name': 'Nagios/Icinga',
          'bucket_total': 5
        }, {
          'segment_name': 'Cloudwatch',
          'bucket_total': 2
        }, {
          'segment_name': 'Manual',
          'bucket_total': 1
        }]
      }],
      'segments': [{
        'segment_name': 'Nagios/Icinga',
        'total_incidents': 40
      }, {
        'segment_name': 'Cloudwatch',
        'total_incidents': 19
      }, {
        'segment_name': 'Manual',
        'total_incidents': 4
      }]
    }
  })
}

export const displayDailyFilledResponse = {
  'has_data_flag': true,
  'display_buckets': [{
    'bucket_start': 1511049600000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511136000000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511222400000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 10
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 5
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511308800000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 2
    }]
  }, {
    'bucket_start': 1511308800000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511395200000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511481600000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511568000000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511654400000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511740800000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 6
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 3
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511827200000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 9
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 4
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511827200000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1511913600000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512000000000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512086400000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 10
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 5
    }, {
      'segment_name': 'Manual',
      'bucket_total': 1
    }]
  }, {
    'bucket_start': 1512086400000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512172800000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512259200000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512345600000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 5
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 2
    }, {
      'segment_name': 'Manual',
      'bucket_total': 1
    }]
  }, {
    'bucket_start': 1512432000000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512518400000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512604800000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512691200000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512777600000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512864000000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1512950400000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1513036800000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1513123200000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1513209600000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1513296000000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1513382400000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1513468800000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }, {
    'bucket_start': 1513555200000,
    'segments_and_values': [{
      'segment_name': 'Nagios/Icinga',
      'bucket_total': 0
    }, {
      'segment_name': 'Cloudwatch',
      'bucket_total': 0
    }, {
      'segment_name': 'Manual',
      'bucket_total': 0
    }]
  }],
  'segments': [{
    'segment_name': 'Nagios/Icinga',
    'total_incidents': 40
  }, {
    'segment_name': 'Cloudwatch',
    'total_incidents': 19
  }, {
    'segment_name': 'Manual',
    'total_incidents': 4
  }]
}
