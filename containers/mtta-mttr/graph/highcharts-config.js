export default {
  legend: { enabled: true },

  title: {
    text: ''
  },

  loading: {
    hideDuration: 100,
    showDuration: 100
  },

  xAxis: {
    tickColor: '#d6d6d6',
    crosshair: {
      width: 1,
      color: '#7e7e7e'
    }
  },

  yAxis: {
    type: 'linear',
    gridLineWidth: 0,
    minRange: 1,
    allowDecimals: false
  },

  tooltip: {
    crosshairs: true,
    shared: true,
    backgroundColor: 'white',
    borderColor: '#7e7e7e',
    valueDecimals: 0,
    borderRadius: 10,
    borderWidth: 2
  },

  plotOptions: {
    line: {
      enableMouseTracking: true,
      marker: {
        enabled: false
      }
    }
  }
}
