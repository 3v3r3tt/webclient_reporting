import React from 'react'
// import Highcharts from 'highcharts'
import ReactHighcharts from 'react-highcharts'

function Graph (props) {
  return (
    <div>
      <ReactHighcharts config={props.data.toJS()} />
    </div>
  )
}

export default Graph
