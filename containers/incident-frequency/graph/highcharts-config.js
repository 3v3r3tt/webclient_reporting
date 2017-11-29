export default {
  legend: { enabled: false },

  title: {
    text: 'Untitled'
  },

  xAxis: {
    type: 'linear',
    gridLineWidth: 1,
    tickInterval: 1,
    tickColor: '#d6d6d6',
    crosshair: {
      width: 1,
      color: '#7e7e7e'
    },

    plotLines: [{
      color: 'black',
      width: 2,
      zIndex: 20
    }]
  },

  yAxis: {
    type: 'linear',
    gridLineWidth: 0
  },

  tooltip: {
    crosshairs: true,
    shared: true,
    backgroundColor: 'white',
    borderColor: '#7e7e7e',
    valueDecimals: 0
  },

  plotOptions: {
    line: {
      enableMouseTracking: true,
      marker: {
        enabled: false
      }
    },

    area: {
      stacking: 'normal'
    }
  }
}
