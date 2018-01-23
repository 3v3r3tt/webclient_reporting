// vendor
import React, {
    PureComponent
} from 'react'

export default class ActionItems extends PureComponent {
  _getActionItem (item) {
    return (
      <li key={item.get('id')}>{item.get('body')}</li>
    )
  }

  _getActionItemContents () {
    return (
      <ul>
        {this.props.actionItems.map(this._getActionItem)}
      </ul>
    )
  }

  render () {
    if (this.props.actionItems.size > 0) {
      return (
        <div className='post-mortem--actionlist post-mortem--sidebar_section'>
          <div className='page-header'>
            <h4 className='post-mortemsummary--header text--bold heading-5'>Action items</h4>
          </div>
          { this._getActionItemContents()}
        </div>
      )
    } else {
      return (
        <div className='post-mortem--actionlist post-mortem--sidebar_section' />
      )
    }
  }
}
