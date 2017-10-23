import React from 'react'
import ReactHighcharts from 'react-highcharts'

function Graph (props) {
  const GraphContent = props.data
    ? <ReactHighcharts config={props.data} />
    : <p>Loading Graph...</p>

  return (
    <div>
      {GraphContent}
    </div>
  )
}

export default Graph
