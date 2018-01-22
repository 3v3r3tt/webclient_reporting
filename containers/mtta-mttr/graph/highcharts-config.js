export default {
  legend: {
    enabled: true,
    align: 'right',
    verticalAlign: 'top'
  },

  title: {
    text: ''
  },

  loading: {
    hideDuration: 100,
    showDuration: 100
  },

  xAxis: {
    title: {
      text: 'Date'
    },
    tickColor: '#d6d6d6',
    type: 'datetime',
    dateTimeLabelFormats: {
      hour: '<br />',
      day: '%b %e',
      week: '%b %e, %Y',
      month: '%b %Y'
    },
    crosshair: {
      width: 1,
      color: '#7e7e7e'
    }
  },
  tooltip: {
    crosshairs: true,
    shared: true,
    backgroundColor: 'white',
    borderColor: '#7e7e7e',
    valueDecimals: 0,
    borderRadius: 10,
    borderWidth: 2,
    headerFormat: '<span style="font-size: 14px; text-decoration: underline; font-weight: bold;">{point.key}</span><br/>'
  }
}
