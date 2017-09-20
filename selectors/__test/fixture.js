import {
  fromJS,
  Set
} from 'immutable'

export const state = {
  'overrides': {
    'entities': {
      'assignments': fromJS({
        '2634:chaosphere': {
          'id': 57,
          'team': {
            'slug': 'meshuggah',
            'name': 'meshuggah'
          },
          'policy': {
            'slug': 'chaosphere',
            'name': 'chaosphere'
          },
          'overrider': {
            'username': 'notJakub',
            'firstName': 'Jakub',
            'lastName': 'Muhle'
          }
        },
        '2636:obzen': {
          'team': {
            'slug': 'meshuggah',
            'name': 'meshuggah'
          },
          'policy': {
            'slug': 'obzen',
            'name': 'obzen'
          }
        },
        '8567:nothing': {
          'id': 91,
          'team': {
            'slug': 'meshuggah',
            'name': 'meshuggah'
          },
          'policy': {
            'slug': 'nothing',
            'name': 'nothing'
          },
          'overrider': {
            'username': 'mhagstrom',
            'firstName': 'Marten',
            'lastName': 'Hagstrom'
          }
        },
        '3405:everyone': {
          'team': {
            'slug': 'everyone',
            'name': 'everyone'
          },
          'policy': {
            'slug': 'everyone',
            'name': 'everyone'
          }
        }
      }),
      'overrides': fromJS({
        '2634': {
          'id': 2634,
          'user': {
            'username': 'theJakub',
            'firstName': 'Jakub',
            'lastName': 'Muhle'
          },
          'timezone': 'America/Denver',
          'start': '2017-04-28T20:00:00.000Z',
          'end': '2017-05-18T06:30:00.000Z',
          'assignments': [
            '2634:chaosphere'
          ],
          'overlaps': false
        },
        '2636': {
          'id': 2636,
          'user': {
            'firstName': 'Jakub',
            'lastName': 'Muhle',
            'username': 'theJakub'
          },
          'timezone': 'America/Denver',
          'start': '2017-08-28T20:00:00.000Z',
          'end': '2017-09-18T06:30:00.000Z',
          'assignments': [
            '2636:obzen'
          ],
          'overlaps': false
        },
        '8567': {
          'id': 8567,
          'user': {
            'username': 'specialdefects',
            'firstName': 'Fredrik',
            'lastName': 'Thordenal'
          },
          'timezone': 'America/Denver',
          'start': '2017-04-28T20:00:00.000Z',
          'end': '2017-05-18T06:30:00.000Z',
          'assignments': [
            '8567:nothing'
          ],
          'overlaps': false
        },
        '3405': {
          'id': 3405,
          'user': {
            'firstName': 'Dick',
            'lastName': 'Lovgren',
            'username': 'dlovgren'
          },
          'timezone': 'America/Denver',
          'start': '2017-08-28T20:00:00.000Z',
          'end': '2017-09-18T06:30:00.000Z',
          'assignments': [
            '3405:everyone'
          ],
          'overlaps': false
        }
      })
    },
    'result': Set([ 2634, 2636, 8567, 3405 ])
  },

  'policies': fromJS({
    '24304': {
      'policy': {
        'id': 24304,
        'name': 'everyone',
        'slug': 'everyone'
      },
      'steps': [ 78274 ],
      'team': 'foo',
      'teams': [ 'foo' ]
    }
  }),

  'policyActions': fromJS({
    '128942': {
      'id': 128942,
      'kind': 'rotation_group',
      'rotationGroup': {
        'org_slug': 'vops_gg',
        'team_slug': 'everyone',
        'group_id': 16880,
        'label': 'Denver'
      }
    },
    '134418': {
      'id': 134418,
      'kind': 'user',
      'user': {
        'username': 'superawesome',
        'firstName': 'Super',
        'lastName': 'Awesome',
        'version': 2
      }
    }
  }),

  'policySteps': fromJS({
    '78274': {
      'id': 78274,
      'timeout': 0,
      'actions': [
        128942,
        134418
      ]
    }
  }),

  'routes': fromJS({
    309046: {
      'id': 309046,
      'routeKey': 'meshuggah',
      'targets': [
        {
          'teamName': 'Band Members',
          'teamSlug': 'band-members',
          'policyName': 'catch33',
          'policySlug': 'catch33'
        },
        {
          'teamName': 'Band Members',
          'teamSlug': 'band-members',
          'policyName': 'Destroy Erase Improve',
          'policySlug': 'destroy-erase-improve'
        },
        {
          'teamName': 'Band Members',
          'teamSlug': 'band-members',
          'policyName': 'Nothing',
          'policySlug': 'nothing'
        },
        {
          'teamName': 'Band Members',
          'teamSlug': 'band-members',
          'policyName': 'Chaosphere',
          'policySlug': 'chaosphere'
        },
        {
          'teamName': 'Band Members',
          'teamSlug': 'band-members',
          'policyName': 'Koloss',
          'policySlug': 'koloss'
        },
        {
          'teamName': 'Band Members',
          'teamSlug': 'band-members',
          'policyName': 'Violent Sleep of Reason',
          'policySlug': 'violent-sleep-of-reason'
        },
        {
          'teamName': 'empty',
          'teamSlug': 'empty',
          'policyName': 'empty',
          'policySlug': 'empty'
        }
      ],
      'rank': 0,
      'isDefault': false
    },
    312105: {
      'id': 312105,
      'routeKey': '.+',
      'targets': [
        {
          'teamName': 'Band Members',
          'teamSlug': 'band-members',
          'policyName': 'Destroy Erase Improve',
          'policySlug': 'destroy-erase-improve'
        },
        {
          'teamName': 'empty',
          'teamSlug': 'empty',
          'policyName': 'empty',
          'policySlug': 'empty'
        },
        {
          'teamName': 'über möögle',
          'teamSlug': 'uhber-mokotgle',
          'policyName': 'hello world',
          'policySlug': 'hello-world'
        }
      ],
      'rank': 108,
      'isDefault': true
    },
    326486: {
      'id': 326486,
      'routeKey': '33',
      'targets': [
        {
          'teamName': 'Band Members',
          'teamSlug': 'band-members',
          'policyName': 'catch33',
          'policySlug': 'catch33'
        }
      ],
      'rank': 0,
      'isDefault': false
    }
  })
}

export const selectedPolicies = fromJS({
  24304: {
    'team': 'foo',
    'teams': ['foo'],
    'policy': {
      'id': 24304,
      'name': 'everyone',
      'slug': 'everyone'
    },
    'steps': [
      {
        'id': 78274,
        'timeout': 0,
        'actions': [
          {
            'id': 128942,
            'kind': 'rotation_group',
            'rotationGroup': {
              'org_slug': 'vops_gg',
              'team_slug': 'everyone',
              'group_id': 16880,
              'label': 'Denver'
            }
          },
          {
            'id': 134418,
            'kind': 'user',
            'user': {
              'username': 'superawesome',
              'firstName': 'Super',
              'lastName': 'Awesome',
              'version': 2
            }
          }
        ]
      }
    ]
  }
})

export const selectedOverrides = Set([
  fromJS({
    'id': 2634,
    'user': {
      'username': 'theJakub',
      'firstName': 'Jakub',
      'lastName': 'Muhle'
    },
    'timezone': 'America/Denver',
    'start': '2017-04-28T20:00:00.000Z',
    'end': '2017-05-18T06:30:00.000Z',
    'assignments': [
      '2634:chaosphere'
    ],
    'overlaps': false
  }),
  fromJS({
    'id': 2636,
    'user': {
      'firstName': 'Jakub',
      'lastName': 'Muhle',
      'username': 'theJakub'
    },
    'timezone': 'America/Denver',
    'start': '2017-08-28T20:00:00.000Z',
    'end': '2017-09-18T06:30:00.000Z',
    'assignments': [
      '2636:obzen'
    ],
    'overlaps': false
  }),
  fromJS({
    'id': 8567,
    'user': {
      'username': 'specialdefects',
      'firstName': 'Fredrik',
      'lastName': 'Thordenal'
    },
    'timezone': 'America/Denver',
    'start': '2017-04-28T20:00:00.000Z',
    'end': '2017-05-18T06:30:00.000Z',
    'assignments': [
      '8567:nothing'
    ],
    'overlaps': false
  }),
  fromJS({
    'id': 3405,
    'user': {
      'firstName': 'Dick',
      'lastName': 'Lovgren',
      'username': 'dlovgren'
    },
    'timezone': 'America/Denver',
    'start': '2017-08-28T20:00:00.000Z',
    'end': '2017-09-18T06:30:00.000Z',
    'assignments': [
      '3405:everyone'
    ],
    'overlaps': false
  })
])

export const selectedOverridesByTeam = {
  'Muhle': [
    {
      'id': 2634,
      'user': {
        'username': 'theJakub',
        'firstName': 'Jakub',
        'lastName': 'Muhle'
      },
      'timezone': 'America/Denver',
      'start': '2017-04-28T20:00:00.000Z',
      'end': '2017-05-18T06:30:00.000Z',
      'assignments': [
        '2634:chaosphere'
      ],
      'overlaps': false
    },
    {
      'id': 2636,
      'user': {
        'firstName': 'Jakub',
        'lastName': 'Muhle',
        'username': 'theJakub'
      },
      'timezone': 'America/Denver',
      'start': '2017-08-28T20:00:00.000Z',
      'end': '2017-09-18T06:30:00.000Z',
      'assignments': [
        '2636:obzen'
      ],
      'overlaps': false
    }
  ],
  'Thordenal': [
    {
      'id': 8567,
      'user': {
        'username': 'specialdefects',
        'firstName': 'Fredrik',
        'lastName': 'Thordenal'
      },
      'timezone': 'America/Denver',
      'start': '2017-04-28T20:00:00.000Z',
      'end': '2017-05-18T06:30:00.000Z',
      'assignments': [
        '8567:nothing'
      ],
      'overlaps': false
    }
  ]
}

export const selectedOverrideAssignments = fromJS({
  '2634:chaosphere': {
    'id': 57,
    'team': {
      'slug': 'meshuggah',
      'name': 'meshuggah'
    },
    'policy': {
      'slug': 'chaosphere',
      'name': 'chaosphere'
    },
    'overrider': {
      'username': 'notJakub',
      'firstName': 'Jakub',
      'lastName': 'Muhle'
    }
  },
  '2636:obzen': {
    'team': {
      'slug': 'meshuggah',
      'name': 'meshuggah'
    },
    'policy': {
      'slug': 'obzen',
      'name': 'obzen'
    }
  },
  '8567:nothing': {
    'id': 91,
    'team': {
      'slug': 'meshuggah',
      'name': 'meshuggah'
    },
    'policy': {
      'slug': 'nothing',
      'name': 'nothing'
    },
    'overrider': {
      'username': 'mhagstrom',
      'firstName': 'Marten',
      'lastName': 'Hagstrom'
    }
  },
  '3405:everyone': {
    'team': {
      'slug': 'everyone',
      'name': 'everyone'
    },
    'policy': {
      'slug': 'everyone',
      'name': 'everyone'
    }
  }
})

export const routesByPolicy = fromJS({
  'catch33': Set([
    'meshuggah',
    '33'
  ]),
  'destroy-erase-improve': Set([
    'meshuggah',
    '.+'
  ]),
  'nothing': Set([
    'meshuggah'
  ]),
  'chaosphere': Set([
    'meshuggah'
  ]),
  'violent-sleep-of-reason': Set([
    'meshuggah'
  ]),
  'koloss': Set([
    'meshuggah'
  ])
})
