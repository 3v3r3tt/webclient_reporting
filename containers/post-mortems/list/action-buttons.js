import React from 'react'
import config from 'components/__utils/config'
import Victory from '@victorops/victory'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { deletePostMortem } from 'reporting/actions/post-mortems'

const { ModalConfirm } = Victory

function mapDispatchToProps (dispatch) {
  return {
    deletePostMortem: (payload) => dispatch(deletePostMortem(payload))
  }
}

class ReportsActionButtons extends React.Component {
  constructor () {
    super()

    this.state = {
      showModal: false
    }
    this._onConfirm = this._onConfirm.bind(this)
  }

  _showEditCtl () {
    return (this.props.owner === config.auth.user.username ||
            this.props.can_edit === true)
  }

  _showDelCtl () {
    return (this.props.owner === config.auth.user.username ||
            this.props.can_delete === true)
  }

  _onConfirm () {
    this.props.deletePostMortem({token: this.props.token})
    this.setState({showModal: false})
  }

  _modal () {
    const bodyHtml = <p>You're about to delete <strong>{this.props.title}</strong>. Are you sure?</p>

    return (
      <ModalConfirm
        title='Delete Report?'
        component={bodyHtml}
        onConfirm={this._onConfirm}
        confirmButtonText='Delete'
        confirmButtonType='danger'
        onCancel={() => this.setState({showModal: false})}
        isVisible={this.state.showModal}
      />
    )
  }

  _deleteButton () {
    if (this._showDelCtl()) {
      return (
        <a onClick={() => this.setState({showModal: true})} className='js-remove js-tooltip row-control' title='Delete this report' ><i className='fas fa-times' /></a>
      )
    } else {
      return null
    }
  }

  _editButton () {
    if (this._showEditCtl()) {
      return (
        <Link to={`/reports/${this.props.orgslug}/post-mortem/${this.props.token}/edit`} className='js-tooltip row-control' title='Edit this report' ><i className='fas fa-pencil-alt' /></Link>
      )
    } else {
      return null
    }
  }

  render () {
    return (
      <div onClick={(e) => e.stopPropagation()} className='row-controls pull-right'>
        { this._editButton() }
        { this._deleteButton() }
        <div className='text-left'>
          { this._modal() }
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(ReportsActionButtons)
