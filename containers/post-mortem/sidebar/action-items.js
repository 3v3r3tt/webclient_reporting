// vendor
import React, {
    PureComponent
} from 'react'

export default class ActionList extends PureComponent {
  constructor (props) {
    super(props)

    this.showAddActionItem = this.props.showAddActionItem.bind(this)
    this.showRemoveActionItem = this.props.showRemoveActionItem.bind(this)
  }

  getActionItemContents () {
    if (this.props.actionItems.size) {
      const ActionItemList = this.props.actionItems.toJSON().map((actionItem) => {
        const removeActionItem = () => this.showRemoveActionItem(actionItem.id)
        return (
          <li key={actionItem.id}>
            {actionItem.body}&nbsp;
            (<a onClick={removeActionItem} className='post-mortem--sidebar--delete-action-item'>delete</a>)
          </li>
        )
      })
      return (
        <ul className='margin-bottom-10'>
          { ActionItemList }
        </ul>
      )
    } else {
      return (
        <p>
          <i>
            Any actions that need to be taken to prevent this from happening in the future.
          </i>
        </p>
      )
    }
  }

  render () {
    return (
      <div className='post-mortem--actionlist post-mortem--sidebar_section'>
        <h1 className='post-mortem--sidebar_header'>Action items</h1>

        {this.getActionItemContents()}
        <a onClick={this.showAddActionItem}>+ add action item</a>
      </div>
    )
  }
}
