export default {
  legend: { enabled: false },

  title: {
    text: ''
  },

  loading: {
    hideDuration: 100,
    showDuration: 100
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
    borderWidth: 2,
    headerFormat: '<span style="font-size: 14px; text-decoration: underline; font-weight: bold;">{point.key}</span><br/>',
    pointFormatter: function () {
      return (
        `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b> ${this.y.toLocaleString()}</b><br/>`
      )
    }
  },

  plotOptions: {
    area: {
      stacking: 'normal'
    },
    series: {
      marker: {
        symbol: 'circle'
      }
    }
  }
}
