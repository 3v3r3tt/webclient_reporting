import React from 'react'
import ReactHighcharts from 'react-highcharts'
import Victory from '@victorops/victory'

const {
  Button
} = Victory

function Graph (props) {
  const GraphContent = props.data
    ? <ReactHighcharts config={props.data} />
    : <p>Loading Graph...</p>

  let buttonClass = 'btn btn-outline-warning incident-frequency--graph--button'

  return (
    <div className='incident-frequency--graph'>
      {GraphContent}

      <Button
        content='Reset'
        type={!props.drawButton ? buttonClass + ' display--none' : buttonClass}
        clickHandler={() => { props.reset() }} />
    </div>
  )
}

export default Graph
