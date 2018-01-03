import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import moment from 'moment'

import Victory from '@victorops/victory'
const { Table } = Victory

function mapStateToProps (state) {
  return {
    data: state.mttaMttr.getIn(['table', 'data', 'incidents']),
    loading: state.mttaMttr.getIn(['table', 'loading'], true)
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

class MttaMttrTable extends Component {
  _transformIncidentName (name, transmog) {
    const transmogIconComponent = <i className='far fa-strikethrough' />
    const transmogIcon = transmog ? transmogIconComponent : null
    return () =>
      <div className='mtta-mttr--table--incident-name'>
        {transmogIcon} {name}
      </div>
  }

  _transformPages (pages) {
    if (pages === 1) return pages.toString() + ' page'
    else if (pages > 1) return pages.toString() + ' pages'
    else return ''
  }

  _transformReroutes (reroutes) {
    if (reroutes === 1) return reroutes.toString() + ' reroute'
    else if (reroutes > 1) return reroutes.toString() + ' reroutes'
    else return ''
  }

  _formatTimeSpacing (time) {
    while (time.length < 2) {
      time = '0' + time
    }

    return time
  }

  _transformTime (time) {
    let hours = Math.floor(moment.duration(time).asHours()).toString()
    let minutes = moment.duration(time).minutes().toString()
    hours = this._formatTimeSpacing(hours)
    minutes = this._formatTimeSpacing(minutes)
    return hours + ':' + minutes
  }

  _transformRows (data) {
    let reducedData = null
    if (data) {
      reducedData = data.map((item, index) => {
        const incident = item.get('incident')
        const date = item.get('date')
        const timeToAck = item.get('time_to_ack', 0)
        const timeToRes = item.get('time_to_res', 0)
        const pages = item.get('pages', 0)
        const reroutes = item.get('reroutes', 0)
        const transmog = item.get('transmog', false)

        const formattedDate = moment(date).format('MMM. D, YYYY')
        const formattedTimeToAck = this._transformTime(timeToAck)
        const formattedTimeToRes = this._transformTime(timeToRes)

        const formattedPages = this._transformPages(pages)
        const formattedReroutes = this._transformReroutes(reroutes)

        const formattedIncidentName = this._transformIncidentName(incident, transmog)

        return {
          id: item.get('id'),
          key: index,
          columns: [
            {type: 'component', component: formattedIncidentName, value: incident},
            {type: 'cell', content: formattedDate, value: date},
            {type: 'cell', content: formattedTimeToAck, value: timeToAck},
            {type: 'cell', content: formattedTimeToRes, value: timeToRes},
            {type: 'cell', content: formattedPages, value: pages},
            {type: 'cell', content: formattedReroutes, value: reroutes}
          ]
        }
      })
    }
    return reducedData
  }

  render () {
    const rowItems = this._transformRows(this.props.data)
    const tableData = {
      index: 1,
      columnWidths: ['30%', '10%', '15%', '15%', '15%', '15%'],
      columnHeaders: [
        {label: 'Incidents', isSortable: true},
        {label: 'Date', isSortable: true},
        {label: 'Time to Ack.', isSortable: true},
        {label: 'Time to Res.', isSortable: true},
        {label: '# Pages', isSortable: true},
        {label: '# Reroutes', isSortable: true}
      ],
      rowItems: rowItems ? rowItems.toJS() : []
    }

    return (
      <div className='mtta-mttr--table has-loading-gradient'>
        <ReactCSSTransitionGroup
          transitionName='mtta-mttr--transition'
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={200}>
          <Table
            {...tableData}
            showLoader={this.props.loading} />
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttrTable)
