import React, { Component } from 'react'
import { connect } from 'react-redux'

import { hideModal } from 'reporting/actions/modal'
import { ModalConfirm } from '@victorops/victory'

function mapStateToProps (state) {
  return {
    modalConfig: state.modal.get('config') && state.modal.get('config').toJS(),
    showModal: state.modal.get('open', false)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onCancel: () => { dispatch(hideModal()) }
  }
}

class Modal extends Component {
  render () {
    let modalProps = this.props.modalConfig && this.props.modalConfig.modalProps
    return (
      <ModalConfirm
        {...modalProps}
        isVisible={this.props.showModal}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
