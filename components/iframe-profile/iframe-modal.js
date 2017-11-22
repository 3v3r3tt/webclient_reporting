import React from 'react'

function iframeModal (props) {
  const config = props.auth.config
  const org = config.get('orgslug', '')
  const location = `/dash/${org}/?iframe#profile`
  const username = config.getIn(['auth', 'user', 'username'], '')
  return (
    <div>
      <div className='modal-backdrop fade-in' />
      <div className='js-modal-profile vo-modal vo-modal-profile vo-modal-full vo-modal-iframe fade in' tabIndex='-1' role='dialog' style={{'zIndex': '10000'}}>
        <div>
          <div className='js-profile-header profile-header'>
            <div className='shadow-cover'>
              <span data-dismiss='modal' onClick={() => props.modalActions.hideIframeModal()} aria-hidden='true' title='Click or [esc] to close' ><i className='fas fa-times' /></span>
              <h4><span className='subtitle'>Profile:</span> @{username}</h4>
            </div>
          </div>
          <iframe scrolling='no' className='js-profile-iframe' src={location} style={{'height': '580px'}} />
        </div>
      </div>
    </div>
  )
}

export default iframeModal
