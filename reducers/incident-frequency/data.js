// Options:
// chart.type ['line', 'column', 'bar', 'area']
// yAxis.type ['linear', 'logarithmic']
// plotOptions.area.stacking ['normal', null]

const data = {
  chart: {
    type: 'line'
  },

  title: {
    text: 'Incident Frequency Report'
  },

  xAxis: {
    categories: ['Jan 16', 'Feb 16', 'Mar 16', 'Apr 16', 'May 16', 'Jun 16', 'Jul 16', 'Aug 16', 'Sep 16', 'Oct 16', 'Nov 16', 'Dec 16'],
    type: 'linear',
    gridLineWidth: 1,
    tickInterval: 1,
    tickColor: '#d6d6d6',
    tickmarkPlacement: 'on',
    crosshair: {
      width: 1,
      color: '#7e7e7e'
    }
  },
  yAxis: {
    type: 'linear',
    title: {
      text: 'Number of Incidents'
    },
    gridLineWidth: 0
  },

  tooltip: {
    crosshairs: true,
    shared: true,
    backgroundColor: 'white',
    borderColor: '#7e7e7e'
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
  },

  series: [{
    name: 'Nagios',
    data: [29, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54]
  }, {
    name: 'New Relic',
    data: [216, 194, 95, 54, 29, 71, 106, 129, 144, 176, 135, 148]
  }, {
    name: 'Webhook',
    data: [9, 10, 38, 39, 96, 112, 144, 186, 200, 228, 231, 267]
  }, {
    name: 'Zendesk',
    data: [46, 65, 70, 78, 82, 136, 160, 161, 183, 237, 257, 264]
  }]
}

export default data
