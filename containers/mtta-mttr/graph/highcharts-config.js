export default {
  legend: {
    enabled: true,
    align: 'right',
    verticalAlign: 'top',
    symbolRadius: 0
  },

  plotOptions: {
    series: {
      stickyTracking: false
    }
  },

  title: {
    text: ''
  },

  loading: {
    hideDuration: 100,
    showDuration: 100
  },

  tooltip: {
    shared: true,
    backgroundColor: 'white',
    borderColor: '#7e7e7e',
    valueDecimals: 0,
    borderRadius: 10,
    borderWidth: 2,
    headerFormat: '<span style="font-size: 14px; text-decoration: underline; font-weight: bold;">{point.key}</span><br/>'
  }
}
