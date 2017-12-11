import React from 'react'

const Placeholder = () =>
  <div className='incident-frequency--not-enough-data'>
    <div className='incident-frequency--not-enough-data--content'>
      <h2 className='header'>You don't have enough data to graph (yet)</h2>
      <p className='details'>Incident Frequency is a powerful tool for <strong>uncovering your noisiest services, hosts and integrations,</strong> but you haven’t been using VictorOps long enough to benefit from it.</p>

      <p className='details'><strong>Here are a few examples</strong> of Incident Frequency reports that you might see once you use VictorOps a bit more:</p>
      <div className='images'>
        <img className='image' src='/public/img/IFR_demoimg.png' />
        <img className='image' src='/public/img/IFR_demoimg.png' />
        <img className='image' src='/public/img/IFR_demoimg.png' />
      </div>
    </div>
  </div>

export default Placeholder
