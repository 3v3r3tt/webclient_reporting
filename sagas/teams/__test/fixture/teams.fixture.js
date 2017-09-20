export const payload = {
  formData: {
    selectedUsers: [{
      firstName: 'Andrew',
      label: 'Andrew Fager',
      lastName: 'Fager',
      value: 'graveviolin'
    }],
    team: 'test'
  },
  success: () => {},
  error: () => {}
}

export const usernames = {
  usernames: ['graveviolin']
}

export const response = {
  'added': ['graveviolin'],
  'notAdded': []
}

export const user = {
  team: 'test',
  user: {
    firstName: 'Andrew',
    lastName: 'Fager',
    username: 'graveviolin'
  }
}
