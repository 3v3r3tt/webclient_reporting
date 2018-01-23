export const actionItems = {
  getResponse: [
    {
      id: 1,
      body: 'Remember to do the thing'
    },
    {
      id: 2,
      body: 'Check all the guages before launching.'
    }
  ]
}

export const report = {
  getResponse: {
    'begin': 1499439600919,
    end: 1499722200821,
    title: 'A Big Report',
    annotations: [{
      sequence: 4,
      source: 'Totally jynxed it',
      rendered: '<p>Totally jynxed it</p>'
    }, {
      'sequence': 51,
      'source': 'Oh man things are really going haywire',
      'rendered': '<p>Oh man things are really going haywire</p>'
    }, {
      'sequence': 117,
      'source': 'The very last timeline note',
      'rendered': '<p>The very last timeline note</p>'
    }],
    'token': 'D7sxZhu4IQJDVkeZ~N2fKVWEGF4g409bkr5gSzNAU3s9-JIlkSCksFXq7TZ72L16',
    'owner': 'paulevmo'
  }
}

export const timeline = {
  getResponse: {
    timeline: [{
      sequence: 1,
      serviceTime: 1499455068000
    }, {
      sequence: 2,
      serviceTime: 1499455075000
    }, {
      sequence: 3,
      serviceTime: 1499455104000
    }, {
      sequence: 4,
      serviceTime: 1499455127000
    }, {
      sequence: 6,
      serviceTime: 1499455129000
    }, {
      sequence: 7,
      serviceTime: 1499455172000
    }, {
      sequence: 8,
      serviceTime: 1499455202000
    }, {
      sequence: 9,
      serviceTime: 1499455267000
    }, {
      sequence: 10,
      serviceTime: 1499455267000
    }, {
      sequence: 11,
      serviceTime: 1499455267000
    }, {
      sequence: 12,
      serviceTime: 1499455276000
    }, {
      sequence: 13,
      serviceTime: 1499455279000
    }, {
      sequence: 51,
      serviceTime: 1499455279000
    }]
  }
}

export const annotatedTimelineNotes = [
  {
    'rendered': '<p>Totally jynxed it</p>',
    'sequence': 4,
    'source': 'Totally jynxed it',
    'timeStamp': 1499455127000
  },
  {
    'rendered': '<p>Oh man things are really going haywire</p>',
    'sequence': 51,
    'source': 'Oh man things are really going haywire',
    'timeStamp': 1499455279000
  },
  {
    'rendered': '<p>The very last timeline note</p>',
    'sequence': 117,
    'source': 'The very last timeline note',
    'timeStamp': 'N/A'
  }
]
